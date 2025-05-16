import React, { useMemo } from "react";
import { PasswordStrength } from "@/types/auth";

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
}

/**
 * A visual indicator for password strength
 *
 * @param strength - The calculated password strength level
 * @returns A JSX element representing the password strength indicator
 */
const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
}) => {
  // Determine colors and width based on strength
  const { barColor, barWidth, strengthText } = useMemo(() => {
    switch (strength) {
      case PasswordStrength.WEAK:
        return {
          barColor: "bg-red-500",
          barWidth: "w-1/4",
          strengthText: "Weak",
        };
      case PasswordStrength.MEDIUM:
        return {
          barColor: "bg-yellow-500",
          barWidth: "w-2/4",
          strengthText: "Medium",
        };
      case PasswordStrength.STRONG:
        return {
          barColor: "bg-green-500",
          barWidth: "w-3/4",
          strengthText: "Strong",
        };
      case PasswordStrength.VERY_STRONG:
        return {
          barColor: "bg-emerald-500",
          barWidth: "w-full",
          strengthText: "Very Strong",
        };
      default:
        return {
          barColor: "bg-gray-300",
          barWidth: "w-0",
          strengthText: "Enter password",
        };
    }
  }, [strength]);

  return (
    <div className="mt-2 space-y-1" role="status" aria-live="polite">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">Password strength:</p>
        <p
          className={`text-xs font-medium ${
            strength === PasswordStrength.WEAK
              ? "text-red-500"
              : strength === PasswordStrength.MEDIUM
                ? "text-yellow-600"
                : strength === PasswordStrength.STRONG
                  ? "text-green-600"
                  : strength === PasswordStrength.VERY_STRONG
                    ? "text-emerald-600"
                    : "text-gray-500"
          }`}
        >
          {strengthText}
        </p>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} ${barWidth} transition-all duration-300 ease-in-out`}
          role="progressbar"
          aria-valuenow={
            strength === PasswordStrength.WEAK
              ? 25
              : strength === PasswordStrength.MEDIUM
                ? 50
                : strength === PasswordStrength.STRONG
                  ? 75
                  : strength === PasswordStrength.VERY_STRONG
                    ? 100
                    : 0
          }
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
      <div className="text-xs text-gray-500">
        {strength === PasswordStrength.WEAK && (
          <p>
            Use at least 8 characters with uppercase, lowercase, numbers, and
            special characters.
          </p>
        )}
        {strength === PasswordStrength.MEDIUM && (
          <p>
            Good! Try adding more character variety for a stronger password.
          </p>
        )}
        {strength === PasswordStrength.STRONG && (
          <p>Great password! Consider making it longer for maximum security.</p>
        )}
        {strength === PasswordStrength.VERY_STRONG && (
          <p>Excellent password! Your account will be well protected.</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(PasswordStrengthIndicator);
