import { createBrowserRouter } from "react-router";
import { appRoutes } from "@/constants/app-routes";

// Pages
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import ProtectedRoute from "./protected-route";
import {
  ForgotPassword,
  Login,
  Register,
  ResetPassword,
  VerifyEmail,
} from "@/pages/Authentication";
import Profile from "@/components/user-account/profile";
import ProfileSettings from "@/components/user-account/profile-settings";

const router = createBrowserRouter([
  // renders at "/"
  { index: true, element: <Home /> },

  // authentication routes
  {
    element: <Login />,
    path: appRoutes.auth.login,
  },
  {
    element: <Register />,
    path: appRoutes.auth.register,
  },
  {
    element: <VerifyEmail />,
    path: appRoutes.auth.verifyEmail,
  },
  {
    element: <ForgotPassword />,
    path: appRoutes.auth.forgotPassword,
  },
  {
    element: <ResetPassword />,
    path: appRoutes.auth.resetPassword,
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
    path: appRoutes.dashboard.path,
    children: [
      // renders at "/dashboard"
      { index: true, Component: Dashboard },
      // { path: "settings", Component: DashboardSettings }
    ],
  },
]);

export default router;
