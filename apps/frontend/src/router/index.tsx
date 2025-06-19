import { createBrowserRouter, RouteObject } from 'react-router';
import routes from './routes';
import AuthLayout from '@/layouts/authentication';
import DefaultLayout from '@/layouts/DefaultLayout';
import DashboardLayout from '@/layouts/dashboard';

const layoutComponents = {
  auth: AuthLayout,
  dashboard: DashboardLayout,
  default: DefaultLayout,
};

const finalRoutes = routes.map((route) => {
  // @ts-ignore
  const LayoutComponent = layoutComponents[route.layout] || layoutComponents.default;

  return {
    ...route,
    element: (
      <LayoutComponent>
        {route.element}
      </LayoutComponent>
    ),
  };
});

const router = createBrowserRouter(finalRoutes as RouteObject[]);

export default router;