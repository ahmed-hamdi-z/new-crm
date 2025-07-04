import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TOGGLES_KEY } from "@/constants/toggles";
import { TogglesStateProps } from "@/types/toggles";

const useToggleRTL = () => {
  const queryClient = useQueryClient();

  return useMutation<TogglesStateProps, Error, "ltr" | "rtl">({
    mutationFn: async (rtlClass) => {
      const currentToggles: TogglesStateProps =
        queryClient.getQueryData([TOGGLES_KEY]) || {};

      const updatedToggles = { ...currentToggles, rtlClass };
      localStorage.setItem(TOGGLES_KEY, JSON.stringify(updatedToggles));
      document.documentElement.setAttribute("dir", rtlClass);

      return updatedToggles;
    },
    onSuccess: (updatedToggles) => {
      queryClient.setQueryData([TOGGLES_KEY], updatedToggles);
    },
  });
};

export default useToggleRTL;
