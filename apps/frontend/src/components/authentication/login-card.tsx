import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";

import { DottedSeparator } from "@/components/global/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Constants and typess
import { appRoutes } from "@/constants/app-routes";
import { loginSchema, LoginFormValues, AuthError } from "@/types/auth";

// Hooks
import { useLogin } from "@/hooks/authentication/useLogin";
import { useResponsiveDesign } from "@/hooks/global/useMediaQuery";
import SocialAuthButton from "./social-auth-button";

/**
 * Renders a login card with email/password inputs, remember me option,
 * password recovery, and social login options.
 *
 * @returns A JSX element representing the enhanced login card.
 */
const LoginCard: React.FC = () => {
  const { mutate, isPending } = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<AuthError | null>(null);
  const { prefersReducedMotion } = useResponsiveDesign();

  // Memoize form to prevent unnecessary re-renders
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

//  Toggles password visibility
  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  /**
   * Submits the login form with the given values to the server.
   * @param values The values to submit, with the shape of the loginSchema.
   */
  const onSubmit = React.useCallback(
    (values: LoginFormValues) => {
      setAuthError(null);
      mutate(values, {
        onError: (error) => {
          setAuthError({
            message: error.message || "Failed to login. Please try again.",
          });
        },
      });
    },
    [mutate]
  );

    // Handles social login success
  const handleSocialLoginSuccess = React.useCallback((response: any) => {
    console.log("Social login success:", response);
    // Handle successful social login here
  }, []);

  //  Handles social login error
  const handleSocialLoginError = React.useCallback((error: any) => {
    console.error("Social login error:", error);
    setAuthError({
      message: "Social login failed. Please try again or use email login.",
    });
  }, []);

  // Memoize social login buttons to prevent unnecessary re-renders
  const socialLoginButtons = useMemo(
    () => (
      <>
        <SocialAuthButton
          action="login"
          provider="google"
          icon={<FcGoogle className="size-5" />}
          isLoading={isPending}
          onSuccess={handleSocialLoginSuccess}
          onError={handleSocialLoginError}
        />

        <SocialAuthButton
          action="login"
          provider="github"
          icon={<FaGithub className="size-5" />}
          isLoading={isPending}
          onSuccess={handleSocialLoginSuccess}
          onError={handleSocialLoginError}
        />
      </>
    ),
    [isPending, handleSocialLoginSuccess, handleSocialLoginError]
  );

  // Animation classes based on user preferences
  const animationClass = useMemo(
    () => (prefersReducedMotion ? "" : "animate-fadeIn"),
    [prefersReducedMotion]
  );

  return (
    <Card
      className={`w-full h-full md:w-[487px] shadow-sm shadow-slate-400 ${animationClass}`}
    >
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        {authError && (
          <Alert
            variant="destructive"
            className="mb-2 border-none flex items-center justify-center"
            role="alert"
          >
            <AlertDescription className=" text-center text-red-800 ">
              {authError.message}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email" className="sr-only">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      autoComplete="email"
                      aria-label="Email"
                      aria-required="true"
                      className="focus:ring-2 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage aria-live="polite" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password" className="sr-only">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        autoComplete="current-password"
                        aria-label="Password"
                        aria-required="true"
                        className="pr-10 focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5" />
                        ) : (
                          <FaEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage aria-live="polite" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <Link
                to={appRoutes.auth.forgotPassword || "#"}
                className="text-sm text-blue-700 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isPending}
              size="lg"
              aria-busy={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="flex flex-col gap-y-4 p-7">
        {socialLoginButtons}
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p className="text-center">
          Don&apos;t have an account?
          <Link
            to={appRoutes.auth.register}
            className="text-blue-700 hover:text-blue-800 hover:underline ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(LoginCard);
