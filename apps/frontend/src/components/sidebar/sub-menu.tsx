import { MenuItem } from "@/types/sidebar";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

const SubMenu = ({ 
  items, 
  isVisible,
  prefersReducedMotion 
}: { 
  items: MenuItem[]; 
  isVisible: boolean;
  prefersReducedMotion?: boolean;
}) => {
  const { t } = useTranslation();
  
  return (
    <AnimateHeight 
      duration={prefersReducedMotion ? 0 : 300} 
      height={isVisible ? "auto" : 0}
    >
      <ul className="sub-menu text-gray-500">
        {items.map((item) => (
          <li key={item.key}>
            <NavLink to={item.path}>{t(item.label)}</NavLink>
          </li>
        ))}
      </ul>
    </AnimateHeight>
  );
};

export default SubMenu;