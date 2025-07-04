import { CollapseIcon } from "@/assets/icons/sidebar-icons";
import { NavLink } from "react-router";
const LOGO_PATH = "/assets/images/logo.svg";

const SidebarHeader = ({ 
  onToggle, 
  brandText 
}: { 
  onToggle: () => void; 
  brandText: string; 
}) => (
  <div className="flex justify-between items-center px-4 py-3">
    <NavLink to="/" className="main-logo flex items-center shrink-0">
      <img
        className="w-8 ml-[5px] flex-none"
        src={LOGO_PATH}
        alt="logo"
      />
      <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">
        {brandText}
      </span>
    </NavLink>

    <button
      type="button"
      className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
      onClick={onToggle}
      aria-label="Toggle sidebar"
    >
      <CollapseIcon />
    </button>
  </div>
);

export default SidebarHeader