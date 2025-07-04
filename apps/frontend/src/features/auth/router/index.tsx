import { RouteObject } from "@/types/route.object";
import AUTH_ROUTES from "./route.path";
import { lazy } from "react";

const Login = lazy(() => import("@/pages/Auth/login"));
const Register = lazy(() => import("@/pages/Auth/register"));
const ForgotPassword = lazy(() => import("@/pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/Auth/ResetPassword"));
const ConfirmAccount = lazy(() => import("@/pages/Auth/ConfirmAccount"));
const VerifyMfaLogin = lazy(() => import("@/pages/Auth/VerifyMfa"));

const authenticationRoutePaths: RouteObject[] = [
  { path: AUTH_ROUTES.SIGN_IN, element: <Login /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <Register /> },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: AUTH_ROUTES.RESET_PASSWORD, element: <ResetPassword /> },
  { path: AUTH_ROUTES.VERIFY_EMAIL, element: <ConfirmAccount /> },
  { path: AUTH_ROUTES.VERIFY_MFA_LOGIN, element: <VerifyMfaLogin /> },
];

export default authenticationRoutePaths;
