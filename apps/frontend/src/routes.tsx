import { createBrowserRouter } from 'react-router';
import  baseRoutePaths  from './features/home/router';
import AuthLayout from './layouts/auth-layout';
import authenticationRoutePaths from './features/auth/router';
import workspaceRoutePaths from './features/workspace/router';
import ProtectedRoute from './features/auth/router/protected-route';

const baseRoute = baseRoutePaths.map((route) => ({
  ...route,
  element: route.element,
}))

const authenticationRoute =  authenticationRoutePaths.map((route) => ({
  ...route,
  element: (
    <AuthLayout>
      {route.element}
    </AuthLayout>
  )
}))

const workspaceRoute = workspaceRoutePaths.map((route) => ({
  ...route,
  element: (
    <ProtectedRoute>
      {route.element}
    </ProtectedRoute>
  )
}))
export const router = createBrowserRouter([
  ...baseRoute,
  ...authenticationRoute,
  ...workspaceRoute
]);