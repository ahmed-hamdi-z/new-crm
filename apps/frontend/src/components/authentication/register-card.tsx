import React, {  useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import PasswordStrengthIndicator from "./password-strength-indicator";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Icons
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa"; // Added FaSpinner

// Hooks & Types
import { useRegister } from "@/hooks/authentication/useRegister";
import { appRoutes } from "@/constants/app-routes";
import {
  registerSchema,
  RegisterFormValues,
  AuthError,
  calculatePasswordStrength,
  PasswordStrength,
} from "@/types/auth";
import { useResponsiveDesign } from "@/hooks/global/useMediaQuery";
import SocialLoginButton from "./social-auth-button";

/**
 * Renders a registration card with inputs for username, email, password, and confirmation.
 * Includes password strength indicator, password visibility toggle, and social registration options.
 * Optimized for performance and accessibility.
 *
 * @returns A JSX element representing the enhanced registration card.
 */
const RegisterCard: React.FC = () => {
  const { mutate, isPending, error: apiError } = useRegister();
  const [authError, setAuthError] = React.useState<AuthError | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState<PasswordStrength>(
    PasswordStrength.WEAK
  );
  const { prefersReducedMotion } = useResponsiveDesign();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = form.watch("password");

  // Update password strength when password changes
  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(passwordValue || ""));
  }, [passwordValue]);

  // Toggle password visibility
  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = React.useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  // Handle form submission
  const onSubmit = React.useCallback(
    (values: RegisterFormValues) => {
      setAuthError(null);
      mutate(values, {
        onError: (error) => {
          const errorMessage =
            error.message || "Registration failed. Please try again.";
          setAuthError({
            message: errorMessage,
          });

          // Set form error for specific fields or a general error
          form.setError("root.serverError", {
            type: "manual",
            message: errorMessage,
          });
        },
      });
    },
    [mutate, form]
  );
  // Handle social auth success/error
  const handleSocialAuthSuccess = React.useCallback((response: any) => {
    console.log("Social registration success:", response);
    // Handle successful social registration (e.g., redirect)
  }, []);

  const handleSocialAuthError = React.useCallback((error: any) => {
    console.error("Social registration error:", error);
    setAuthError({
      message:
        "Social registration failed. Please try again or use email registration.",
    });
  }, []);

  // Memoize social auth buttons
  const socialAuthButtons = useMemo(
    () => (
      <>
        <SocialLoginButton
          provider="google"
          action="register"
          icon={<FcGoogle className="size-5" />}
          isLoading={isPending}
          onSuccess={handleSocialAuthSuccess}
          onError={handleSocialAuthError}
        />
        <SocialLoginButton
          provider="github"
          action="register"
          icon={<FaGithub className="size-5" />}
          isLoading={isPending}
          onSuccess={handleSocialAuthSuccess}
          onError={handleSocialAuthError}
        />
      </>
    ),
    [isPending, handleSocialAuthSuccess, handleSocialAuthError]
  );

  // Animation classes based on user preferences
  const animationClass = useMemo(
    () => (prefersReducedMotion ? "" : "animate-fadeIn"),
    [prefersReducedMotion]
  );

  // Get server error message
  const serverErrorMessage = form.formState.errors.root?.serverError?.message;

  return (
    <Card
      className={`w-full h-full md:w-[487px] shadow-sm shadow-slate-400 ${animationClass}`}
    >
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link
            to={appRoutes.privacy || "/privacy"}
            className="text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            to={appRoutes.terms || "/terms"}
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
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        autoComplete="new-password"
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.password}
                        aria-describedby="password-error password-strength-desc"
                        className="pr-10 focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none rounded"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5" />
                        ) : (
                          <FaEye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <PasswordStrengthIndicator strength={passwordStrength} />
                  <FormMessage id="password-error" aria-live="polite" />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.confirmPassword}
                        aria-describedby="confirmPassword-error"
                        className="pr-10 focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none rounded"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password confirmation"
                            : "Show password confirmation"
                        }
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-5 w-5" />
                        ) : (
                          <FaEye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage id="confirmPassword-error" aria-live="polite" />
                </FormItem>
              )}
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
        {socialAuthButtons}
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p className="text-center">
          Already have an account?
          <Link
            to={appRoutes.auth.login}
            className="text-blue-700 hover:text-blue-800 hover:underline ml-1 focus:outline-none rounded"
          >
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default React.memo(RegisterCard);
