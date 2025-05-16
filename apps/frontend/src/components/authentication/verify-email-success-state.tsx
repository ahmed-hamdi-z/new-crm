import React, { useMemo } from "react";
import { MdOutlineVerified } from "react-icons/md";
import { Card } from "@/components/ui/card";
import { AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router";
import { appRoutes } from "@/constants/app-routes";
import { useResponsiveDesign } from "@/hooks/global/useMediaQuery";

interface SuccessStateProps {
  onContinue?: () => void;
}
/**
 * Renders the success state for the email verification card.
 *
 * @param onContinue - Optional callback function when user clicks to continue
 * @returns A JSX element representing the success state.
 */
export const SuccessState: React.FC<SuccessStateProps> = ({ onContinue }) => {
  const { prefersReducedMotion } = useResponsiveDesign();

  const animationClass = useMemo(
    () => (prefersReducedMotion ? "" : "animate-fadeIn"),
    [prefersReducedMotion]
  );

  return (
    <Card
      className={`w-full h-full flex flex-col items-center justify-center p-3 ${animationClass}`}
    >
      <MdOutlineVerified
        className="w-12 h-12 text-green-500"
        aria-hidden="true"
      />
      <AlertTitle className="text-xl font-semibold mb-2 text-center">
        Email Verified Successfully!
      </AlertTitle>
      <AlertDescription className="text-gray-600 text-center mb-6">
        Thank you for verifying your email address. Your account is now fully
        activated.
      </AlertDescription>
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link
          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          to={appRoutes.auth.login}
          onClick={onContinue}
        >
          Sign In to Your Account
        </Link>
        <Link
          className="text-blue-600 hover:text-blue-800 px-4 py-2 text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
          to={appRoutes.home}
          replace
        >
          Go to Homepage
        </Link>
      </div>
    </Card>
  );
};

export default SuccessState;
