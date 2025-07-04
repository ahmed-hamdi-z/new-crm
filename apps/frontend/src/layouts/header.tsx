import { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import useToggleTheme from "@/hooks/toggles/useToggleTheme";
import useToggleSidebar from "@/hooks/toggles/useToggleSidebar";
import { DEFAULT_TOGGLES, TOGGLES_KEY } from "@/constants/toggles";
import { TogglesStateProps } from "@/types/toggles";
import { useQueryClient } from "@tanstack/react-query";
import {
  IconMenu,
  IconCalendar,
  IconTodo,
  IconSun,
  IconMoon,
  IconSystem,
  IconDashboard,
  IconChevronRight,
} from "@/assets/icons/header-icons";
import UserDropdown from "@/components/header/user-button";

const Header = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const toggleThemeMutation = useToggleTheme();
  const toggleSidebarMutation = useToggleSidebar();
  const queryClient = useQueryClient();

  const toggles =
    queryClient.getQueryData<TogglesStateProps>([TOGGLES_KEY]) ||
    DEFAULT_TOGGLES;

  const { rtlClass, theme, isDarkMode, menu } = toggles;
  const isRtl = rtlClass === "rtl";

  // Handle active menu items based on current route
  useEffect(() => {
    const selector = document.querySelector(
      `ul.horizontal-menu a[href="${window.location.pathname}"]`
    );

    if (selector) {
      selector.classList.add("active");
      const allActiveLinks = document.querySelectorAll(
        "ul.horizontal-menu .nav-link.active"
      );

      allActiveLinks.forEach((link, index) => {
        if (index > 0) link.classList.remove("active");
      });

      const subMenu = selector.closest("ul.sub-menu");
      if (subMenu) {
        const parentLink = subMenu
          .closest("li.menu")
          ?.querySelector(".nav-link");
        if (parentLink) {
          setTimeout(() => parentLink.classList.add("active"));
        }
      }
    }
  }, [location.pathname]);

  const handleThemeToggle = () => {
    if (theme === "light") toggleThemeMutation.mutate("dark");
    else if (theme === "dark") toggleThemeMutation.mutate("system");
    else toggleThemeMutation.mutate("light");
  };

  const ThemeIcon = () => {
    switch (theme) {
      case "light":
        return <IconSun className="w-5 h-5" />;
      case "dark":
        return <IconMoon className="w-5 h-5" />;
      case "system":
        return <IconSystem className="w-5 h-5" />;
      default:
        return <IconSun className="w-5 h-5" />;
    }
  };

  const dashboardMenuItems = [
    { text: t("sales"), to: "/" },
    { text: t("analytics"), to: "/analytics" },
    { text: t("finance"), to: "/finance" },
    { text: t("crypto"), to: "/crypto" },
  ];

  return (
    <header className={isDarkMode && menu === "horizontal" ? "dark" : ""}>
      <div className="shadow-sm">
        <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
          {/* Logo and Mobile Menu Toggle */}
          <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
            <Link to="/" className="main-logo flex items-center shrink-0">
              <img
                className="w-8 ltr:-ml-1 rtl:-mr-1 inline"
                src="/assets/images/logo.svg"
                alt="logo"
              />
              <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle hidden md:inline dark:text-white-light transition-all duration-300">
                Click
              </span>
            </Link>
            <button
              type="button"
              className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
              onClick={() => toggleSidebarMutation.mutate()}
              aria-label="Toggle sidebar"
            >
              <IconMenu className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Icons */}
          <div className="ltr:mr-2 rtl:ml-2 hidden sm:block">
            <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
              <li>
                <Link
                  to="/apps/calendar"
                  className="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                  aria-label="Calendar"
                >
                  <IconCalendar className="w-5 h-5" />
                </Link>
              </li>
              <li>
                <Link
                  to="/apps/todolist"
                  className="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                  aria-label="Todo List"
                >
                  <IconTodo className="w-5 h-5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Side Controls */}
          <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
            <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>

            {/* Theme Toggle */}
            <div>
              <button
                className="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                onClick={handleThemeToggle}
                aria-label={`Toggle ${theme} theme`}
              >
                <ThemeIcon />
              </button>
            </div>

            {/* User Dropdown */}
            <UserDropdown isRtl={isRtl} />
          </div>
        </div>

        {/* Horizontal Menu */}
        <ul className="horizontal-menu hidden py-1.5 font-semibold px-6 lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse bg-white border-t border-[#ebedf2] dark:border-[#191e3a] dark:bg-black text-black dark:text-white-dark">
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconDashboard className="w-5 h-5" />
                <span className="px-1">{t("dashboard")}</span>
              </div>
              <div className="right_arrow">
                <IconChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </button>
            <ul className="sub-menu">
              {dashboardMenuItems.map((item, index) => (
                <li key={index}>
                  <NavLink to={item.to}>{item.text}</NavLink>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
