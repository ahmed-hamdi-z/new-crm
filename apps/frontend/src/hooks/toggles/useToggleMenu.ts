import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TOGGLES_KEY } from "@/constants/toggles";
import { TogglesStateProps } from "@/types/toggles";

const useToggleMenu = () => {
    const queryClient = useQueryClient();

    return useMutation<TogglesStateProps, Error, "horizontal" | "vertical" | "collapsible-vertical">({
        mutationFn: async (menu) => {
            const currentToggles: TogglesStateProps = 
                queryClient.getQueryData([TOGGLES_KEY]) || {};

            const updatedToggles = { ...currentToggles, menu, sidebar: false };
            localStorage.setItem(TOGGLES_KEY, JSON.stringify(updatedToggles));

            return updatedToggles;
        },
        onSuccess: (updatedToggles) => {
            queryClient.setQueryData([TOGGLES_KEY], updatedToggles);
        },
    });
};

export default useToggleMenu;
