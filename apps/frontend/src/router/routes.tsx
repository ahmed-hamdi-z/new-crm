import { appRoutes } from "@/constants/app-routes";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import ProtectedRoute from "../components/authentication/protected-route";
import {
  ForgotPassword,
  Login,
  Register,
  ResetPassword,
  VerifyEmail,
} from "@/pages/Authentication";
import Profile from "@/components/user-account/profile";
import ProfileSettings from "@/components/user-account/profile-settings";
import { JSX } from "react";

export type RouteObject = {
  index?: boolean;
  element?: JSX.Element;
  path?: string;
  children?: RouteObject[];
  layout?: string;
  Component?: JSX.Element;
};

const routes: RouteObject[] = [
  { index: true, element: <Home /> },

  // authentication routes
  {
    element: <Login />,
    path: appRoutes.auth.login,
    layout: "auth",
  },
  {
    element: <Register />,
    path: appRoutes.auth.register,
    layout: "auth",
  },
  {
    element: <VerifyEmail />,
    path: appRoutes.auth.verifyEmail,
    layout: "auth",
  },
  {
    element: <ForgotPassword />,
    path: appRoutes.auth.forgotPassword,
    layout: "auth",
  },
  {
    element: <ResetPassword />,
    path: appRoutes.auth.resetPassword,
    layout: "auth",
  },
  {
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    path: appRoutes.user.profile,
  },
  {
    element: (
      <ProtectedRoute>
        <ProfileSettings />
      </ProtectedRoute>
    ),
    path: appRoutes.user.profileSettings,
  },
  {
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    layout: "dashboard",
    path: appRoutes.dashboard.path,
    children: [
      // renders at "/dashboard"
      { index: true, Component: <Dashboard /> },
      // { path: "settings", Component: DashboardSettings }
    ],
  },
];

export default routes;
