import { createBrowserRouter } from 'react-router';
import  baseRoutePaths  from './features/home/router';
import AuthLayout from './layouts/auth-layout';
import authenticationRoutePaths from './features/auth/router';

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

export const router = createBrowserRouter([
  ...baseRoute,
  ...authenticationRoute
]);