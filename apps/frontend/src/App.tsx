import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "./config/query-client";
import { Toaster } from "@/components/ui/sonner";

/**
 * The App component sets up the main application context and routing.
 * It uses React's Suspense to handle fallback loading states,
 * provides a QueryClient for managing server state with react-query,
 */

function App() {
  return (
    <React.Suspense fallback="loaging...">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.Suspense>
  );
}

export default App;
