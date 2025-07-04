import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TOGGLES_KEY } from "@/constants/toggles";
import { TogglesStateProps } from "@/types/toggles";

const useToggleTheme = () => {
  const queryClient = useQueryClient();

  return useMutation<TogglesStateProps, Error, "light" | "dark" | "system">({
    mutationFn: async (theme) => {
      const currentToggles: TogglesStateProps =
        (queryClient.getQueryData([TOGGLES_KEY]) as TogglesStateProps) || {};

      const isDarkMode =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia?.("(prefers-color-scheme: dark)").matches);

      // Update local storage
      const updatedToggles = { ...currentToggles, theme, isDarkMode };
      localStorage.setItem(TOGGLES_KEY, JSON.stringify(updatedToggles));

      // Update DOM
      document.body.classList.toggle("dark", isDarkMode);

      return updatedToggles;
    },

    onSuccess: (updatedToggles) => {
      queryClient.setQueryData([TOGGLES_KEY], updatedToggles);
    },
  });
};

export default useToggleTheme;
