import { JSX, useMemo } from "react";
import { useNavigate } from "react-router";
import { HomeIcon, FileLockIcon, SettingsIcon } from "lucide-react"; 
import { FaTasks } from "react-icons/fa"; 
import { useTranslation } from "react-i18next";

export interface ButtonSection {
  id: string;
  title: string;
  icon: JSX.Element;
  path: string;
}

const SidebarButton = ({
  section,
  isActive,
  onClick,
}: {
  section: ButtonSection;
  isActive?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    className={`${isActive ? "active" : ""} nav-link group w-full`}
    onClick={onClick}
    aria-expanded={isActive}
    aria-label={`Toggle ${section.title} menu`}
  >
    <div className="flex items-center">
      {section.icon}
      <p className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
        {section.title}
      </p>
    </div>
  </button>
);

// Main Sidebar Component
const SidebarGroupButtons = ({
  workspaceId,
  currentActive,
}: {
  workspaceId: string;
  currentActive: string;
  className?: string;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
    [t, workspaceId]
  );

  return (
    <div>
      <ul className="relative font-semibold space-y-0.5  py-0">
        {buttonSections.map((section) => (
          <li key={section.id} className="menu nav-item relative">
            <SidebarButton
              section={section}
              isActive={currentActive === section.id}
              onClick={() => navigate(section.path)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarGroupButtons;
