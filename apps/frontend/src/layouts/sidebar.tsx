import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DEFAULT_TOGGLES, TOGGLES_KEY } from "@/constants/toggles";
import { TogglesStateProps } from "@/types/toggles";
import useToggleSidebar from "@/hooks/toggles/useToggleSidebar";
import { useResponsiveDesign } from "@/hooks/shared/useMediaQuery";
import { MenuSection } from "@/types/sidebar";
import { HomeIcon } from "@/assets/icons/sidebar-icons";
import SidebarHeader from "@/components/sidebar/sidebar-header";
import MenuButton from "@/components/sidebar/menu-button";
import SubMenu from "@/components/sidebar/sub-menu";
import SectionHeader from "@/components/sidebar/header-section";

const SIDEBAR_WIDTH = 260;

const useActiveMenuItem = () => {
  useEffect(() => {
    const selector = document.querySelector(
      `.sidebar ul a[href="${window.location.pathname}"]`
    );
    if (selector) {
      selector.classList.add("active");
      const ul = selector.closest("ul.sub-menu");
      if (ul) {
        const ele = ul.closest("li.menu")?.querySelector(".nav-link");
        if (ele) {
          setTimeout(() => {
            (ele as HTMLElement).click();
          });
        }
      }
    }
  }, []);
};

const useResponsiveSidebar = (toggles: TogglesStateProps, location: any) => {
  const { mutate: toggleSidebar } = useToggleSidebar();
  const { isMobile, isTablet } = useResponsiveDesign();

  useEffect(() => {
    if ((isMobile || isTablet) && toggles.sidebar) {
      toggleSidebar();
    }
  }, [location, toggleSidebar, toggles.sidebar, isMobile, isTablet]);

  return { toggleSidebar, isMobile, isTablet };
};

const Sidebar = () => {
  const [currentMenu, setCurrentMenu] = useState<string>("");
  const location = useLocation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const toggles = useMemo(
    () =>
      queryClient.getQueryData<TogglesStateProps>([TOGGLES_KEY]) ||
      DEFAULT_TOGGLES,
    [queryClient]
  );

  const menuSections: MenuSection[] = useMemo(
    () => [
      {
        id: "dashboard",
        title: t("dashboard"),
        icon: <HomeIcon />,
        items: [
          { key: "sales", label: "sales", path: "/" },
          { key: "analytics", label: "analytics", path: "/analytics" },
          { key: "finance", label: "finance", path: "/finance" },
          { key: "crypto", label: "crypto", path: "/crypto" },
        ],
      },
    ],
    [t]
  );

  useActiveMenuItem();
  const { toggleSidebar } = useResponsiveSidebar(toggles, location);
  const { prefersReducedMotion } = useResponsiveDesign();

  const toggleMenu = useCallback((value: string) => {
    setCurrentMenu((oldValue) => (oldValue === value ? "" : value));
  }, []);

  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const sidebarClasses = useMemo(
    () =>
      `sidebar fixed min-h-screen h-full top-0 bottom-0 w-[${SIDEBAR_WIDTH}px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${
        toggles.semidark ? "text-white-dark" : ""
      }`,
    [toggles.semidark]
  );

  return (
    <div className={toggles.semidark ? "dark" : ""}>
      <nav className={sidebarClasses}>
        <div className="bg-white dark:bg-black h-full">
          <SidebarHeader
            onToggle={handleToggleSidebar}
            brandText={t("CLICK")}
          />

          <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
              {menuSections.map((section) => (
                <li key={section.id} className="menu nav-item">
                  <MenuButton
                    section={section}
                    isActive={currentMenu === section.id}
                    onClick={() => toggleMenu(section.id)}
                    label={section.title}
                  />
                  <SubMenu
                    items={section.items}
                    isVisible={currentMenu === section.id}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </li>
              ))}

              <SectionHeader title={t("other fields")} />
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
