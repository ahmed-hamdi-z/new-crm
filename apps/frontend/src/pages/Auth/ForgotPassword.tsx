import React, { useState, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/features/auth/types";

import AuthCard from "@/features/auth/components/auth-card";
import { ArrowRight } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const { mutate, isPending } = useForgotPassword();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [param] = useSearchParams();
  const emailFromUrl = param.get("email");

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: emailFromUrl || "",
    },
  });

  const onSubmit = useCallback(
    (values: ForgotPasswordFormValues) => {
      mutate(values, {
        onSuccess: () => {
          setIsSubmitted(true);
        },
      });
    },
    [mutate]
  );

  return (
    <AuthCard
      title="Forgot Your Password?"
      description="Enter your email address below and we'll send you instructions to reset your password."
      isSubmitted={isSubmitted}
      successMessageEmail={form.getValues().email}
    >
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
    </AuthCard>
  );
};

export default memo(ForgotPassword);
