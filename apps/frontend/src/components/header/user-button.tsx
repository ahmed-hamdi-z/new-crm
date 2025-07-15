import { Link } from "react-router";
import Dropdown from "@/components/shared/dropdown";
import {
  IconProfile,
  IconMail,
  IconLock,
  IconLogout,
} from "@/assets/icons/header-icons";


interface UserDropdownProps {
  isRtl: boolean;
}

const UserDropdown = ({ isRtl }: UserDropdownProps) => {
  const userMenuItems = [
    {
      icon: <IconProfile className="ltr:mr-2 rtl:ml-2" />,
      text: "Profile",
      to: "/users/profile"
    },
    {
      icon: <IconMail className="ltr:mr-2 rtl:ml-2" />,
      text: "Inbox",
      to: "/apps/mailbox"
    },
    {
      icon: <IconLock className="ltr:mr-2 rtl:ml-2" />,
      text: "Lock Screen",
      to: "/auth/boxed-lockscreen"
    },
    {
      icon: <IconLogout className="ltr:mr-2 rtl:ml-2 rotate-90" />,
      text: "Sign Out",
      to: "/auth/boxed-signin",
      className: "text-danger !py-3"
    }
  ];

  return (
    <div className="dropdown shrink-0 flex">
      <Dropdown
        offset={[0, 8]}
        placement={isRtl ? "bottom-start" : "bottom-end"}
        btnClassName="relative group block"
        button={
          <img
            className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
            src="/assets/images/user-profile.jpeg"
            alt="User profile"
          />
        }
      >
        <ul className="text-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
          <li>
            <div className="flex items-center px-4 py-4">
              <img
                className="rounded-md w-10 h-10 object-cover"
                src="/assets/images/user-profile.jpeg"
                alt="User"
              />
              <div className="ltr:pl-4 rtl:pr-4">
                <h4 className="text-base">
                  John Doe
                  <span className="text-xs bg-success-light rounded text-success px-1 ltr:ml-2 rtl:ml-2">
                    Pro
                  </span>
                </h4>
                <button
                  type="button"
                  className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                >
                  johndoe@gmail.com
                </button>
              </div>
            </div>
          </li>
          
          {userMenuItems.map((item, index) => (
            <li key={index} className={index === userMenuItems.length - 2 ? "border-t border-white-light dark:border-white-light/10" : ""}>
              <Link 
                to={item.to} 
                className={`dark:hover:text-white ${item.className || ""}`}
              >
                {item.icon}
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;