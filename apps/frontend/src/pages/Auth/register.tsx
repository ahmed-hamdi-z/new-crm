import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

import { appRoutes } from "@/constants/app-routes";
import { useRegister } from "@/features/auth/hooks/useRegister";
import {
  PasswordStrength,
  RegisterFormValues,
  registerSchema,
} from "@/features/auth/types";
import { AuthError } from "@/types/auth.error";
import { SocialAuthProviders } from "@/features/auth/components/social-auth-providers";
import PasswordStrengthIndicator from "@/features/auth/components/password-strength-indicator";

import { DottedSeparator } from "@/components/shared/dotted-separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { calculatePasswordStrength } from "@/features/auth/components/calculate-password-strength";

import AuthCard from "@/features/auth/components/auth-card";
import AUTH_ROUTES from "@/features/auth/router/route.path";

const Register: React.FC = () => {
  const { mutate, isPending, error: apiError } = useRegister();
  const [authError, setAuthError] = React.useState<AuthError | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [passwordStrength, setPasswordStrength] =
    React.useState<PasswordStrength>(PasswordStrength.WEAK);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = form.watch("password");

  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(passwordValue || ""));
  }, [passwordValue]);

  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = React.useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const onSubmit = React.useCallback(
    (values: RegisterFormValues) => {
      setAuthError(null);
      mutate(values, {
        onSuccess: () => {
          setIsSubmitted(true);
        },
        onError: (error) => {
          const errorMessage =
            error.message || "Registration failed. Please try again.";
          setAuthError({ message: errorMessage });
          form.setError("root.serverError", {
            type: "manual",
            message: errorMessage,
          });
        },
      });
    },
    [mutate, form]
  );

  const serverErrorMessage = form.formState.errors.root?.serverError?.message;

  const cardDescription = (
    <>
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
    </>
  );

  return (
    <AuthCard
      title="Sign Up"
      description={cardDescription}
      isSubmitted={isSubmitted}
      successMessageEmail={form.getValues().email}
      successMessage="We just sent a verification link to your email."
    >
      <div className="pb-5 -mt-7">
        {" "}
        {/* Adjust margin to offset CardContent padding */}
        <DottedSeparator />
      </div>
      <div className="">
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
                      aria-describedby="name-error"
                      className="focus:ring-2 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="name-error" aria-live="polite" />
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

        <div className="px-0 pt-7">
          <DottedSeparator />
        </div>

        <div className="flex flex-col gap-y-4 pt-7">
          <SocialAuthProviders
            action="register"
            isLoading={isPending}
            providers={["google"]}
          />
        </div>

        <div className="px-0 pt-7">
          <DottedSeparator />
        </div>
        <div className="p-7 flex items-center justify-center -mb-7">
          {" "}
          {/* Adjust margin to offset CardContent padding */}
          <p className="text-center">
            Already have an account?
            <Link
              to={AUTH_ROUTES.SIGN_IN}
              className="text-blue-700 hover:text-blue-800 hover:underline ml-1 focus:outline-none rounded"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthCard>
  );
};

export default React.memo(Register);
