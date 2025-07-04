import { z } from "zod";

export type loginType = { email: string; password: string };
export type UserResponseType = {
  preferences: any;
  currentWorkspace: any;
  message: string;
  mfaRequired: boolean;
  user?: {
    _id: string;
    email: string;
    name: string;
    currentWorkspace: string;
    profilePicture: string | null;
    isEmailVerified: boolean;
    isActive: boolean;
    lastLogin: string | null;
    preferences: {
      enable2FA: boolean;
      emailNotification: boolean;
      pushNotification: boolean;
      theme: string;
      language: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
};

export type registerType = {
  name: string;
  email: string;
  password: string;
};

export type forgotPasswordType = { email: string };
export type resetPasswordType = { password: string; verificationCode: string };
export type verifyEmailType = { code: string };
export type verifyMFAType = { code: string; secretKey: string };
export type mfaType = {
  message: string;
  secret: string;
  qrImageUrl: string;
};
export type mfaLoginType = { code: string; email: string };
export enum PasswordStrength {
  WEAK = "weak",
  MEDIUM = "medium",
  STRONG = "strong",
  VERY_STRONG = "very-strong",
}

export type SessionType = {
  _id: string;
  userId: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
};

export type SessionResponseType = {
  message: string;
  sessions: SessionType[];
};

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").min(1, {
    message: "Workspace name is required",
  }),
  password: z.string().trim().min(1, {
    message: "Password is required",
  }),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().min(1, {
    message: "Email is required",
  }),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
    confirmPassword: z.string().trim().min(1, {
      message: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const mafSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export type MafSchemaFormValues = z.infer<typeof mafSchema>;
