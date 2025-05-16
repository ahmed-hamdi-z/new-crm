import React, { memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

import useVerifyEmail from "@/hooks/authentication/useVerifyEmail";
import { useResponsiveDesign } from "@/hooks/global/useMediaQuery";

import { SuccessState } from "./verify-email-success-state";
import { ErrorState } from "./verify-email-error-state";
import Loader from "../global/loader";

/**
 * Renders a card that displays the status of an email verification process.
 * It shows loading, success, or error states based on the verification result.
 *
 * @returns A JSX element representing the email verification card.
 */
const VerifyEmailCard: React.FC = () => {
  // Assuming the hook provides these states and a retry function
  const { isPending, isSuccess, isError, error } = useVerifyEmail();

  const { prefersReducedMotion, isMobile } = useResponsiveDesign();

  // Determine the error type to pass to ErrorState
  const errorType = useMemo(() => {
    if (!isError || !error) return undefined;

    return "invalid"; // Default to invalid
  }, [isError, error]);

  // Animation classes based on user preferences
  const animationClass = useMemo(
    () => (prefersReducedMotion ? "" : "animate-fadeIn"),
    [prefersReducedMotion]
  );

  return (
    <Card
      className={`w-full ${isMobile ? "border-0 shadow-none" : "md:w-[487px] shadow-sm shadow-slate-400"} overflow-hidden ${animationClass}`}
      role="region"
      aria-live="polite"
      aria-labelledby="verify-email-status-title"
    >
      <Alert
        variant={isSuccess ? "default" : isError ? "destructive" : "default"}
        className="border-0 p-0"
      >
        {/* Add an ID for aria-labelledby */}
        <div id="verify-email-status-title" className="sr-only">
          Email Verification Status
        </div>
        {isPending ? (
          <Loader />
        ) : isSuccess ? (
          <SuccessState />
        ) : isError ? (
          <ErrorState errorType={errorType} />
        ) : null}
      </Alert>
    </Card>
  );
};

export default memo(VerifyEmailCard); // Apply memoization
