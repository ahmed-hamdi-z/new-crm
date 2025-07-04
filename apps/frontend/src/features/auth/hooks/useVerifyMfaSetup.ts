import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyMFASetupApi } from "../apis";

interface UseVerifyMfaOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useVeriftMfaSetup = (options: UseVerifyMfaOptions = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: verifyMFASetupApi,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast.success(response?.data.message);
      options.onSuccess?.();
    },

    onError: (error: Error) => {
      toast.error(error.message || "");
      options.onError?.(error);
    },
  });

  return mutation;
};
