import React from "react";

interface ToggleButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
  }

const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  isActive,
  onClick,
  icon,
}) => {
  return (
    <button
      type="button"
      className={`${isActive ? "btn-primary" : "btn-outline-primary"} btn `}
      onClick={onClick}
    >
      {icon && (
        <span className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2">{icon}</span>
      )}
      {label}
    </button>
  );
};

export default ToggleButton;
