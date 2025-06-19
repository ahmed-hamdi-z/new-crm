import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PasswordStrength } from "@/types/auth";
import PasswordStrengthIndicator from "./password-strength-indicator";

interface PasswordInputProps {
  id: string;
  name: string;
  placeholder: string;
  showPassword: boolean;
  toggleVisibility: () => void;
  form: UseFormReturn<any>;
  autoComplete?: string;
  showStrengthIndicator?: boolean;
  strength?: PasswordStrength;
  label?: string;
}

export const PasswordInput = React.memo(({
  id,
  name,
  placeholder,
  showPassword,
  toggleVisibility,
  form,
  showStrengthIndicator,
  strength,
  autoComplete = "current-password",
}: PasswordInputProps) => {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <Input
                id={id}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                autoComplete={autoComplete}
                aria-required="true"
                aria-invalid={!!form.formState.errors[name]}
                aria-describedby={`${id}-error ${showStrengthIndicator ? 'password-strength-desc' : ''}`}
                className="pr-10 focus:ring-2 focus:ring-blue-500"
                {...field}
              />
              <Button
                variant="ghost"
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </Button>
            </div>
          </FormControl>
          {showStrengthIndicator && strength !== undefined && (
            <PasswordStrengthIndicator strength={strength} />
          )}
          <FormMessage id={`${id}-error`} aria-live="polite" />
        </FormItem>
      )}
    />
  );
}); 