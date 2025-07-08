import { Link, useNavigate, useSearchParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Frown } from "lucide-react";
import React from "react";
import AuthCard from "@/features/auth/components/auth-card";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { ResetPasswordFormValues, resetPasswordSchema } from "@/features/auth/types/validator";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import AUTH_ROUTES from "@/features/auth/router/route.path";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [params] = useSearchParams();
  const code = params.get("code");
  const exp = Number(params.get("exp"));
  const now = Date.now();

  const isValid = code && exp && exp > now;

  const { mutate, isPending } = useResetPassword();

  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = React.useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

 

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!code) {
      navigate(`/${AUTH_ROUTES.FORGOT_PASSWORD}?email=`);
      return;
    }
    const data = {
      password: values.password,
      verificationCode: code,
    };
    mutate(data);
  };

  return (
    <AuthCard
      title=" Set up a new password"
      description="Enter your new password and confirm it to reset your password."
    >
      <>
        {isValid ? (
         
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
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
                            aria-invalid={
                              !!form.formState.errors.confirmPassword
                            }
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
                      <FormMessage
                        id="confirmPassword-error"
                        aria-live="polite"
                      />
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
                      Reset password...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </form>
            </Form>

        ) : (
          <div className="w-full flex flex-col gap-2 items-center justify-center rounded-md">
            <div className="size-[48px]">
              <Frown size="48px" className="animate-bounce text-red-500" />
            </div>
            <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
              Invalid or expired reset link
            </h2>
            <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
              You can request a new password reset link
            </p>
            <Link to={`/${AUTH_ROUTES.FORGOT_PASSWORD}?email=`}>
              <Button className="h-[40px]">
                <ArrowLeft />
                Go to forgot password
              </Button>
            </Link>
          </div>
        )}
      </>
    </AuthCard>
  );
};

export default React.memo(ResetPassword);
