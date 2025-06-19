import React from "react";
import { Link } from "react-router";

import { DottedSeparator } from "@/components/global/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Components
import { PasswordInput } from "./password-input";
import SocialAuthButton from "./social-auth-button";

// Icons
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaSpinner } from "react-icons/fa";

// Hooks & Types
import { useRegisterForm } from "@/hooks/authentication/useRegisterForm";
import { appRoutes } from "@/constants/app-routes";
import { useResponsiveDesign } from "@/hooks/global/useMediaQuery";

// Social auth buttons component
const SocialButtons = React.memo(({ 
  isPending, 
  onSuccess, 
  onError 
}: { 
  isPending?: boolean;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}) => (
  <>
    <SocialAuthButton
      provider="google"
      action="register"
      icon={<FcGoogle className="size-5" />}
      isLoading={isPending}
      onSuccess={onSuccess}
      onError={onError}
    />
    <SocialAuthButton
      provider="github"
      action="register"
      icon={<FaGithub className="size-5" />}
      isLoading={isPending}
      onSuccess={onSuccess}
      onError={onError}
    />
  </>
));

SocialButtons.displayName = "SocialButtons";

/**
 * Renders a registration card with inputs for username, email, password, and confirmation.
 * Includes password strength indicator, password visibility toggle, and social registration options.
 * Optimized for performance and accessibility.
 */
const RegisterCard: React.FC = () => {
  const {
    form,
    onSubmit,
    isPending,
    authError,
    apiError,
    showPassword,
    showConfirmPassword,
    passwordStrength,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    serverErrorMessage,
    // handleSocialLoginSuccess,
    // handleSocialLoginError,
  } = useRegisterForm();

  const { prefersReducedMotion } = useResponsiveDesign();

  const animationClass = React.useMemo(
    () => (prefersReducedMotion ? "" : "animate-fadeIn"),
    [prefersReducedMotion]
  );

  return (
    <Card
      className={`w-full h-full md:w-[487px] shadow-sm shadow-slate-400 ${animationClass}`}
    >
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link
            to={appRoutes.privacy}
            className="text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            to={appRoutes.terms}
            className="text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            Terms of Service
          </Link>
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        {(authError || apiError || serverErrorMessage) && (
          <Alert variant="destructive" className="mb-4" role="alert">
            <AlertDescription>
              {authError?.message || apiError?.message || serverErrorMessage}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your Name"
                      autoComplete="name"
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.name}
                      aria-describedby="userName-error"
                      className="focus:ring-2 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="userName-error" aria-live="polite" />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Email"
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

            <PasswordInput
              id="password"
              name="password"
              placeholder="Enter Password"
              showPassword={showPassword}
              toggleVisibility={togglePasswordVisibility}
              form={form}
              showStrengthIndicator
              strength={passwordStrength}
              autoComplete="new-password"
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              showPassword={showConfirmPassword}
              toggleVisibility={toggleConfirmPasswordVisibility}
              form={form}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:bg-blue-700 focus:outline-none flex items-center justify-center"
              disabled={isPending}
              size="lg"
              aria-busy={isPending}
              aria-live="polite"
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="flex flex-col gap-y-4 p-7">
        <SocialButtons
          isPending={isPending}
          // onSuccess={handleSocialLoginSuccess}
          // onError={handleSocialLoginError}
        />
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p className="text-center">
          Already have an account?{" "}
          <Link
            to={appRoutes.auth.login}
            className="text-blue-700 hover:text-blue-800 hover:underline ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default React.memo(RegisterCard);
