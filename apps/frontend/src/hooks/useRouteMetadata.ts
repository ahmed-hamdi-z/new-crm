import { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router';
import { routeConfig, RouteMetadata } from '@/routes/config';

/**
 * Custom hook to handle route metadata and title updates
 * @returns The current route's metadata
 */
export const useRouteMetadata = () => {
  const location = useLocation();

  // Find matching route and its metadata
  const findRouteMetadata = (pathname: string): RouteMetadata | undefined => {
    const findInRoutes = (routes: typeof routeConfig): RouteMetadata | undefined => {
      for (const route of routes) {
        // Check if current route matches
        if (route.path && matchPath(route.path, pathname)) {
          return route.metadata;
        }
        // Check index route
        if (route.index && pathname === '/') {
          return route.metadata;
        }
        // Check children routes
        if (route.children) {
          const childMetadata = findInRoutes(route.children);
          if (childMetadata) {
            return childMetadata;
          }
        }
      }
      return undefined;
    };

    return findInRoutes(routeConfig);
  };

  useEffect(() => {
    const metadata = findRouteMetadata(location.pathname);
    if (metadata?.title) {
      document.title = `${metadata.title} | CRM`;
    }
  }, [location.pathname]);

  return findRouteMetadata(location.pathname);
};

export default useRouteMetadata; 