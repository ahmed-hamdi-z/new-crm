import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TOGGLES_KEY } from "@/constants/toggles";
import { TogglesStateProps } from ".";

const useToggleLayout = () => {
    const queryClient = useQueryClient();

    return useMutation<TogglesStateProps, Error, "full" | "boxed-layout">({
        mutationFn: async (layout) => {
            const currentToggles: TogglesStateProps = 
                queryClient.getQueryData([TOGGLES_KEY]) || {};

            const updatedToggles = { ...currentToggles, layout };
            localStorage.setItem(TOGGLES_KEY, JSON.stringify(updatedToggles));

            return updatedToggles;
        },
        onSuccess: (updatedToggles) => {
            queryClient.setQueryData([TOGGLES_KEY], updatedToggles);
        },
    });
};

export default useToggleLayout;
