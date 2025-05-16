import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TOGGLES_KEY } from "@/constants/toggles";
import { TogglesStateProps } from ".";

const useToggleSidebar = () => {
  const queryClient = useQueryClient();

  return useMutation<TogglesStateProps, Error, void>({
    mutationFn: async () => {
      // Get current state
      const currentToggles: TogglesStateProps =
        (queryClient.getQueryData([TOGGLES_KEY]) as TogglesStateProps) || {};

      // Toggle sidebar state
      const updatedToggles = {
        ...currentToggles,
        sidebar: !currentToggles.sidebar,
      };
      localStorage.setItem(TOGGLES_KEY, JSON.stringify(updatedToggles));

      return updatedToggles;
    },

    onSuccess: (updatedToggles) => {
      queryClient.setQueryData([TOGGLES_KEY], updatedToggles);
    },
  });
};

export default useToggleSidebar;
