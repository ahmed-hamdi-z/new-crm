import { createBrowserRouter } from "react-router";
import baseRoutePaths from "./features/home/router";
import AuthLayout from "./layouts/auth-layout";
import authenticationRoutePaths from "./features/auth/router";
import workspaceRoutePaths from "./features/workspace/router";
import ProtectedRoute from "./features/auth/router/protected-route";
import WorkspaceLayout from "./layouts/workspace-layout";
import projectRoutePaths from "./features/projects/router";
import tasksRoutePaths from "./features/tasks/router";

const baseRoute = baseRoutePaths.map((route) => ({
  ...route,
  element: route.element,
}));

const authenticationRoute = authenticationRoutePaths.map((route) => ({
  ...route,
  element: <AuthLayout>{route.element}</AuthLayout>,
}));

const workspaceRoute = workspaceRoutePaths.map((route) => ({
  ...route,
  element: (
    <WorkspaceLayout>
      <ProtectedRoute>{route.element}</ProtectedRoute>
    </WorkspaceLayout>
  ),
}));

const projectRoute = projectRoutePaths.map((route) => ({
  ...route,
  element: (
    <WorkspaceLayout>
      <ProtectedRoute>{route.element}</ProtectedRoute>
    </WorkspaceLayout>
  ),
}));
const tasksRoute = tasksRoutePaths.map((route) => ({
  ...route,
  element: (
    <WorkspaceLayout>
      <ProtectedRoute>{route.element}</ProtectedRoute>
    </WorkspaceLayout>
  ),
}));

export const router = createBrowserRouter([
  ...baseRoute,
  ...authenticationRoute,
  ...workspaceRoute,
  ...projectRoute,
  ...tasksRoute,
]);
