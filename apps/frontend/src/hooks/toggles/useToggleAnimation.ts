import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TOGGLES_KEY } from "@/constants/toggles";
import { TogglesStateProps } from "@/types/toggles";

const useToggleAnimation = () => {
    const queryClient = useQueryClient();

    return useMutation<TogglesStateProps, Error, string>({
        mutationFn: async (animation) => {
            const currentToggles: TogglesStateProps = 
                queryClient.getQueryData([TOGGLES_KEY]) || {};

            const updatedToggles = { ...currentToggles, animation: animation.trim() };
            localStorage.setItem(TOGGLES_KEY, JSON.stringify(updatedToggles));

            return updatedToggles;
        },
        onSuccess: (updatedToggles) => {
            queryClient.setQueryData([TOGGLES_KEY], updatedToggles);
        },
    });
};

export default useToggleAnimation;
