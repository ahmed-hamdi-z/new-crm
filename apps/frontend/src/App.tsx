import React from "react";
import { RouterProvider } from "react-router";
import router from "./router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "./config/query-client";
import { Toaster } from "@/components/ui/sonner";

import Loader from "./components/global/loader";

/**
 * The App component sets up the main application context and routing.
 * It uses React's Suspense to handle fallback loading states,
 * provides a QueryClient for managing server state with react-query,
 * sets up a Toaster for notifications,
 * configures the RouterProvider for client-side routing with the defined routes,
 * and includes ReactQueryDevtools for debugging purposes.
 */

function App() {
  return (
    <React.Suspense fallback={<Loader />}>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.Suspense>
  );
}

export default App;
