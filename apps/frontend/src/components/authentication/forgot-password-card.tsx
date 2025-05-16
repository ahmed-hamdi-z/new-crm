import React, {
  useState,
  useCallback,
  memo,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";

import { DottedSeparator } from "@/components/global/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Icons
import { FaSpinner } from "react-icons/fa";

// Hooks & Types
import { useSendPasswordResetEmail } from "@/hooks/authentication/useSendPasswordResetEmail";
import { appRoutes } from "@/constants/app-routes";
import { AuthError, passwordResetRequestSchema, PasswordResetRequestValues } from "@/types/auth";
import { useResponsiveDesign } from "@/hooks/global/useMediaQuery";

/**
 * Renders a card for requesting a password reset email.
 * Handles form submission, loading states, success feedback, and error display.
 * Optimized for performance and accessibility.
 *
 * @returns A JSX element representing the forgot password card.
 */
const ForgotPasswordCard: React.FC = () => {
  const {
    mutate,
    isPending,
    error: apiError,
    isSuccess,
  } = useSendPasswordResetEmail();
  const [localError, setLocalError] = useState<AuthError | null>(null);
  const { prefersReducedMotion, isMobile } = useResponsiveDesign();
  const successAlertRef = useRef<HTMLDivElement>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);

  const form = useForm<PasswordResetRequestValues>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  /**
   * Submits the email to the server to send a password reset link.
   * @param values - The form values containing the email.
   */
  const onSubmit = useCallback(
    (values: PasswordResetRequestValues) => {
      setLocalError(null); // Clear local error on new submission
      mutate(values.email, {
        onError: (error) => {
          setLocalError({
            message:
              error.message || "Failed to send reset email. Please try again.",
          });
        },
      });
    },
    [mutate]
  );

  // Focus management for accessibility
  useEffect(() => {
    if (isSuccess && successAlertRef.current) {
      successAlertRef.current.focus();
    } else if ((localError || apiError) && errorAlertRef.current) {
      errorAlertRef.current.focus();
    }
  }, [isSuccess, localError, apiError]);

  // Determine error message to display
  const errorMessage = localError?.message || apiError?.message;

  // Animation classes based on user preferences
  const animationClass = useMemo(
    () => (prefersReducedMotion ? "" : "animate-fadeIn"),
    [prefersReducedMotion]
  );

  return (
    <Card
      className={`w-full h-full ${isMobile ? "border-0 shadow-none" : "md:w-[487px] shadow-sm shadow-slate-400"} ${animationClass}`}
      aria-labelledby="forgot-password-title"
    >
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle id="forgot-password-title" className="text-2xl font-bold">
          Forgot Your Password?
        </CardTitle>
        <CardDescription id="forgot-password-description">
          Enter your email address below and we&apos;ll send you instructions to
          reset your password.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {errorMessage && !isSuccess && (
          <Alert
            ref={errorAlertRef}
            variant="destructive"
            className="mb-2 border-none flex items-center justify-center"
            role="alert"
            tabIndex={-1} // Make it focusable
          >
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {isSuccess ? (
          <Alert
            className="mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            role="status"
            tabIndex={-1} // Make it focusable
          >
            <AlertDescription>
              If an account exists with the email provided, password reset
              instructions have been sent. Please check your inbox (and spam
              folder).
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
              aria-describedby="forgot-password-description"
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.email}
                        aria-describedby="email-error"
                        className="focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage id="email-error" aria-live="polite" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                disabled={isPending || isSuccess} // Disable button on success too
                size="lg"
                aria-busy={isPending}
                aria-live="polite"
              >
                {isPending ? (
                  <>
                    <FaSpinner
                      className="animate-spin mr-2"
                      aria-hidden="true"
                    />
                    Sending...
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p className="text-center text-sm">
          {isSuccess ? (
            <Link
              to={appRoutes.auth.login}
              className="text-blue-700 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              Return to Sign In
            </Link>
          ) : (
            <>
              Remember your password?
              <Link
                to={appRoutes.auth.login}
                className="text-blue-700 hover:text-blue-800 hover:underline ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              >
                Sign In
              </Link>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default memo(ForgotPasswordCard);
