import { ButtonSection } from "@/types/sidebar";

const SidebarButtons = ({
  section,
  isActive,
  onClick,
  label,
}: {
  section: ButtonSection;
  isActive?: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    className={`${isActive ? "active" : ""} nav-link group w-full`}
    onClick={onClick}
    aria-expanded={isActive}
    aria-label={`Toggle ${label} menu`}
  >
    <div className="flex items-center">
      {section.icon}
      <p className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
        {label}
      </p>
    </div>
  </button>
);

export default SidebarButtons;
