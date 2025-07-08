import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DEFAULT_TOGGLES, TOGGLES_KEY } from "@/constants/toggles";
import { TogglesStateProps } from "@/types/toggles";
import useToggleSidebar from "@/hooks/toggles/useToggleSidebar";
import { useResponsiveDesign } from "@/hooks/shared/useMediaQuery";
import { ButtonSection } from "@/types/sidebar";
import { HomeIcon } from "@/assets/icons/sidebar-icons";
import SidebarHeader from "@/components/sidebar/sidebar-header";
import SectionHeader from "@/components/sidebar/header-section";
import { DottedSeparator } from "@/components/shared/dotted-separator";
import WorkspaceSwitcher from "@/features/workspace/components/workspace-switcher";
import SidebarButtons from "@/components/sidebar/sidebar-buttons";
import { FileLockIcon, SettingsIcon } from "lucide-react";
import useWorkspaceId from "@/features/workspace/hooks/client/useWorkspaceId";
import { FaTasks } from "react-icons/fa";

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
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();
  const [currentActive] = useState<string>("");
  const location = useLocation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const toggles = useMemo(
    () =>
      queryClient.getQueryData<TogglesStateProps>([TOGGLES_KEY]) ||
      DEFAULT_TOGGLES,
    [queryClient]
  );

  const buttonSections: ButtonSection[] = useMemo(
    () => [
      {
        id: "dashboard",
        title: t("dashboard"),
        icon: <HomeIcon />,
        path: `/workspace/${workspaceId}`,
      },
         {
        id: "tasks",
        title: t("tasks"),
        icon: <FaTasks />,
        path: `/workspace/${workspaceId}/tasks`,
      },
         {
        id: "members",
        title: t("members"),
        icon: <FileLockIcon />,
        path: `/workspace/${workspaceId}/members`,
      },
      {
        id: "settings",
        title: t("settings"),
        icon: <SettingsIcon />,
        path: `/workspace/${workspaceId}/settings`,
      },
    ],
    [t]
  );

  useActiveMenuItem();
  const { toggleSidebar } = useResponsiveSidebar(toggles, location);

  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const sidebarClasses = useMemo(
    () =>
      `sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${
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
          <div className="px-2 pb-2">
            <DottedSeparator />
          </div>
          <WorkspaceSwitcher />
          <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
              {buttonSections.map((section) => (
                <li key={section.id} className="menu nav-item">
                  <SidebarButtons
                    label={section.title}
                    section={section}
                    isActive={currentActive === section.id}
                    onClick={() => navigate(section.path)}
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
