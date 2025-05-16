import { z } from "zod";

// Email schema
export const emailSchema = z.object({
    email: z.string().email().min(1).max(255),
  });
// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
    // rememberMe: z.boolean().default(false),
});

// Registration schema with enhanced validation
export const registerSchema = z.object({
    name: z
      .string()
      .min(6, "Username must be at least 6 characters long")
      .max(50, "Username cannot exceed 50 characters")
      .regex(
        /^[a-zA-Z0-9_\- ]+$/,
        "Username can only contain letters, numbers, spaces, underscores, and hyphens"
      ),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  
  // Password reset request schema
  export const passwordResetRequestSchema = z.object({
    email: z.string().email("Invalid email address"),
  });
  
  // Password reset schema
  export const passwordResetSchema = z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  
  // Type definitions
  export type LoginFormValues = z.infer<typeof loginSchema>;
  export type RegisterFormValues = z.infer<typeof registerSchema>;
  export type PasswordResetRequestValues = z.infer<typeof passwordResetRequestSchema>;
  export type PasswordResetValues = z.infer<typeof passwordResetSchema>;
  
  // Auth error types
  export type AuthError = {
    message: string;
    code?: string;
    field?: string;
  };
  
  // Auth response types
  export type AuthResponse = {
    user: {
      id: string;
      email: string;
      userName?: string;
      avatar?: string;
    };
    token: string;
    refreshToken?: string;
  };
  
  // Password strength levels
  export enum PasswordStrength {
    WEAK = "weak",
    MEDIUM = "medium",
    STRONG = "strong",
    VERY_STRONG = "very-strong"
  }
  
  // Function to calculate password strength
  export const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return PasswordStrength.WEAK;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Determine strength based on score
    if (score < 3) return PasswordStrength.WEAK;
    if (score < 5) return PasswordStrength.MEDIUM;
    if (score < 6) return PasswordStrength.STRONG;
    return PasswordStrength.VERY_STRONG;
  };
  