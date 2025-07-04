import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { revokeMFAApi } from "../apis";

export const useRevokeMfa = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: revokeMFAApi,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast.success(response?.data.message);
    },

    onError: (error: Error) => {
      toast.error(error.message || "");
    },
  });

  return mutation;
};
