import React, { useMemo } from "react";
import { MdErrorOutline } from "react-icons/md";
import { Card } from "@/components/ui/card";
import { AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router";
import { appRoutes } from "@/constants/app-routes";
import { DottedSeparator } from "../global/dotted-separator";
import { useResponsiveDesign } from "@/hooks/global/useMediaQuery";

interface ErrorStateProps {
  errorType?: "expired" | "invalid" | "already-verified" | "server-error";
  onRetry?: () => void;
}

/**
 * Renders the error state for the email verification card.
 *
 * @param errorType - Type of error encountered during verification
 * @param onRetry - Callback function to retry verification
 * @returns A JSX element representing the error state.
 */

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorType = "invalid",
}) => {
  const { prefersReducedMotion } = useResponsiveDesign();

  const animationClass = useMemo(
    () => (prefersReducedMotion ? "" : "animate-fadeIn"),
    [prefersReducedMotion]
  );
  
  // Determine error message based on error type
  const getErrorMessage = () => {
    switch (errorType) {
      case "expired":
        return "This verification link has expired";
      case "already-verified":
        return "This email has already been verified";
      case "server-error":
        return "We encountered a server error while verifying your email";
      case "invalid":
      default:
        return "This verification link is invalid or has been tampered with";
    }
  };

  return (
    <Card className={`w-[487px] h-full flex flex-col items-center justify-center p-3 ${animationClass}`}>
      <MdErrorOutline className="w-8 h-8 text-red-500" aria-hidden="true" />

      <AlertTitle className="text-xl font-semibold mb-2 text-center">
        Verification Failed
      </AlertTitle>
      <AlertDescription className="text-gray-600 text-center mb-6">
        {getErrorMessage()}
      </AlertDescription>

      <DottedSeparator className=" my-4" />

      <div className="">

        <Link
          className="text-blue-600 hover:text-blue-800 px-4 py-2 text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
          to={appRoutes.auth.register}
          replace
        >
          Get a New Verification Link
        </Link>

        <Link
          className="text-gray-600 hover:text-gray-800 px-4 py-2 text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md"
          to={appRoutes.home}
          replace
        >
          Go to Homepage
        </Link>
      </div>
    </Card>
  );
};

export default ErrorState;
