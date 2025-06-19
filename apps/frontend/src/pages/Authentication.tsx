import { FC } from "react";
import LoginCard from "@/components/authentication/login-card";
import RegisterCard from "@/components/authentication/register-card";
import VerifyEmailCard from "@/components/authentication/verify-email-card";
import ForgotPasswordCard from "@/components/authentication/forgot-password-card";
import ResetPasswordCard from "@/components/authentication/reset-password-card";

/**
 * Base Authentication component that wraps all authentication pages
 * with consistent layout and styling
 */

/**
 * Login page component
 * Renders the login form with social authentication options
 */
export const Login: FC = () => <LoginCard />;

/**
 * Registration page component
 * Renders the registration form with email/password and social registration options
 */
export const Register: FC = () => <RegisterCard />;

/**
 * Email verification page component
 * Handles email verification process and displays appropriate status
 */
export const VerifyEmail: FC = () => <VerifyEmailCard />;

/**
 * Forgot password page component
 * Allows users to request a password reset link
 */
export const ForgotPassword: FC = () => <ForgotPasswordCard />;

/**
 * Reset password page component
 * Handles password reset process with token validation
 */
export const ResetPassword: FC = () => <ResetPasswordCard />;

// Export all authentication components as a single object
export const AuthenticationPages = {
  Login,
  Register,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
};

// Default export for backward compatibility
export default AuthenticationPages;
