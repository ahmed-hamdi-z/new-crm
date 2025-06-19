import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import {  useNavigate } from "react-router";
import { toast } from "sonner";

import { 
  RegisterFormValues, 
  registerSchema, 
  AuthError, 
  PasswordStrength, 
  calculatePasswordStrength 
} from "@/types/auth";
import { RegisterApi } from "@/api/authentication-api";
import { appRoutes } from "@/constants/app-routes";

/**
 * Custom hook for handling registration API calls
 * @returns Registration mutation and related utilities
 */
const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: RegisterApi,
    onSuccess: () => {
      toast.success("Registration successful! Please check your email to verify your account.");
      navigate(appRoutes.auth.login, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register");
    },
  });
};

interface PasswordVisibility {
  showPassword: boolean;
  showConfirmPassword: boolean;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
}

/**
 * Custom hook to manage password visibility state
 * @returns Password visibility state and toggle functions
 */
const usePasswordVisibility = (): PasswordVisibility => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => 
    setShowPassword(prev => !prev), []);

  const toggleConfirmPasswordVisibility = useCallback(() => 
    setShowConfirmPassword(prev => !prev), []);

  return {
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  };
};

/**
 * Main hook for handling registration form state and submissions
 * Combines form handling, validation, password strength, and registration mutation
 */
export const useRegisterForm = () => {
  const { mutate, isPending, error: apiError } = useRegister();
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.WEAK);

  const {
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = usePasswordVisibility();

  // Initialize form with validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  // Watch password field for strength calculation
  const passwordValue = form.watch("password");

  // Calculate password strength when password changes
  useEffect(() => {
    const strength = calculatePasswordStrength(passwordValue || "");
    setPasswordStrength(strength);
  }, [passwordValue]);

  // Handle form submission
  const onSubmit = useCallback((values: RegisterFormValues) => {
    setAuthError(null);
    mutate(values, {
      onError: (error) => {
        const errorMessage = error.message || "Registration failed. Please try again.";
        setAuthError({ message: errorMessage });
        form.setError("root.serverError", {
          type: "manual",
          message: errorMessage,
        });
      },
    });
  }, [mutate, form]);

  // Reset error state
  const resetError = useCallback(() => {
    setAuthError(null);
    form.clearErrors("root.serverError");
  }, [form]);

  // Memoize server error message
  const serverErrorMessage = useMemo(() => 
    form.formState.errors.root?.serverError?.message,
    [form.formState.errors.root?.serverError?.message]
  );

  return {
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
    resetError,
  };
}; 