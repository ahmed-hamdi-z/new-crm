import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TOGGLES_KEY } from "@/constants/toggles";
import { TogglesStateProps } from ".";

const useToggleNavbar = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TogglesStateProps, // Mutation return type
    Error, // Error type
    "navbar-sticky" | "navbar-floating" | "navbar-static" // Mutation argument type
  >({
    mutationFn: async (navbar) => {
      // Get current state from cache or fallback to an empty object
      const currentToggles: TogglesStateProps =
        (queryClient.getQueryData([TOGGLES_KEY]) as TogglesStateProps) || {};

      // Update local storage
      const updatedToggles = { ...currentToggles, navbar };
      localStorage.setItem(TOGGLES_KEY, JSON.stringify(updatedToggles));

      return updatedToggles;
    },

    onSuccess: (updatedToggles) => {
      // Update React Query cache
      queryClient.setQueryData([TOGGLES_KEY], updatedToggles);
    },
  });
};

export default useToggleNavbar;
