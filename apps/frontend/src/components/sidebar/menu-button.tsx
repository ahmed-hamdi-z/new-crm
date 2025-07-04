import { ChevronIcon } from "@/assets/icons/sidebar-icons";
import { MenuSection } from "@/types/sidebar";

const MenuButton = ({
  section,
  isActive,
  onClick,
  label
}: {
  section: MenuSection;
  isActive: boolean;
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
      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
        {label}
      </span>
    </div>
    <ChevronIcon isOpen={isActive} />
  </button>
);

export default MenuButton;