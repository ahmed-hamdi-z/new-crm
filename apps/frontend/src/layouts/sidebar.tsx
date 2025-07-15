import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DEFAULT_TOGGLES, TOGGLES_KEY } from "@/constants/toggles";
import { TogglesStateProps } from "@/types/toggles";
import useToggleSidebar from "@/hooks/toggles/useToggleSidebar";
import { useResponsiveDesign } from "@/hooks/shared/useMediaQuery";
import SidebarHeader from "@/components/sidebar/sidebar-header";
import { DottedSeparator } from "@/components/shared/dotted-separator";
import WorkspaceSwitcher from "@/features/workspace/components/workspace-switcher";
import useWorkspaceId from "@/features/workspace/hooks/client/useWorkspaceId";
import SidebarGroupButtons from "@/components/sidebar/sidebar-buttons";
import ProjectsNav from "@/features/projects/components/projects-nav";

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
  const location = useLocation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const pathname = window.location.pathname;
  const toggles = useMemo(
    () =>
      queryClient.getQueryData<TogglesStateProps>([TOGGLES_KEY]) ||
      DEFAULT_TOGGLES,
    [queryClient]
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
          <div className="px-2 pb-2">
            <DottedSeparator />
          </div>

          <SidebarGroupButtons
            workspaceId={workspaceId}
            currentActive={pathname}
          />
          <div className="px-2 pb-2">
            <DottedSeparator />
          </div>

          <ProjectsNav />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
