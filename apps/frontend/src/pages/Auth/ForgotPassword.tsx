import React, { useState, useCallback, memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router";
import { ArrowRight, MailCheckIcon } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Custom Hooks and Utilities
import { useResponsiveDesign } from "@/hooks/shared/useMediaQuery";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

// Constants and Types
import AUTH_ROUTES from "@/features/auth/router/route.path";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/features/auth/types";

/**
 * ForgotPassword component handles the password reset request flow.
 * 
 * Features:
 * - Form validation using Zod schema
 * - Responsive animations based on user preferences
 * - Success state after submission
 * - Pre-fills email from URL params if available
 * - Accessibility compliant form controls
 */
const ForgotPassword: React.FC = () => {
  // Mutation hook for password reset API call
  const { mutate, isPending } = useForgotPassword();
  
  // Hook to check user's motion preference
  const { prefersReducedMotion } = useResponsiveDesign();
  
  // State to track form submission status
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Get email from URL search params if present
  const [param] = useSearchParams();
  const email = param.get("email");

  // Initialize form with validation schema
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: email || "", // Pre-fill email if available in URL
    },
  });

  /**
   * Handles form submission
   * @param values - Form values validated against forgotPasswordSchema
   */
  const onSubmit = useCallback(
    (values: ForgotPasswordFormValues) => {
      mutate(values, {
        onSuccess: () => {
          setIsSubmitted(true); // Show success UI on successful submission
        },
      });
    },
    [mutate]
  );

  // Determine animation class based on user's motion preference
  const animationClass = useMemo(
    () => (prefersReducedMotion ? "" : "animate-fadeIn"),
    [prefersReducedMotion]
  );

  return (
    <Card className={`w-full h-full md:w-[487px] shadow-sm shadow-slate-400 ${animationClass}`}>
      {!isSubmitted ? (
        // Password reset request form
        <>
          <CardHeader className="flex items-center justify-center text-center p-7">
            <CardTitle id="forgot-password-title" className="text-2xl font-bold">
              Forgot Your Password?
            </CardTitle>
            <CardDescription id="forgot-password-description">
              Enter your email address below and we&apos;ll send you instructions to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-7">
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
                  disabled={isPending}
                  size="lg"
                  aria-busy={isPending}
                  aria-live="polite"
                >
                  {isPending ? "Sending..." : "Send reset link"}
                  <ArrowRight className="ml-2" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </>
      ) : (
        // Success state after form submission
        <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
          <div className="size-[48px]">
            <MailCheckIcon size="48px" className="animate-bounce" />
          </div>
          <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
            Check your email
          </h2>
          <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
            We just sent a password reset link to {form.getValues().email}.
          </p>
          <Link to={AUTH_ROUTES.SIGN_IN}>
            <Button className="h-[40px]">
              Go to login
              <ArrowRight />
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default memo(ForgotPassword);