import AuthLayout from "@/layouts/authentication";
import LoginCard from "@/components/authentication/login-card";
import RegisterCard from "@/components/authentication/register-card";
import VerifyEmailCard from "@/components/authentication/verify-email-card";
import ForgotPasswordCard from "@/components/authentication/forgot-password-card";
import ResetPasswordCard from "@/components/authentication/reset-password-card";

export const Login = () => (
  <AuthLayout>
    <LoginCard />
  </AuthLayout>
);

export const Register = () => (
  <AuthLayout>
    <RegisterCard />
  </AuthLayout>
);

export const VerifyEmail = () => (
  <AuthLayout>
    <VerifyEmailCard />
  </AuthLayout>
);

export const ForgotPassword = () => (
  <AuthLayout>
    <ForgotPasswordCard />
  </AuthLayout>
);

export const ResetPassword = () => (
  <AuthLayout>
    <ResetPasswordCard />
  </AuthLayout>
);
