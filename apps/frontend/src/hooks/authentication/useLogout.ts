import { logoutApi } from "@/api/authentication-api";
import queryClient from "@/config/query-client";
import { Current } from "@/constants/shared";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const AUTH_QUERY_KEY = ['auth'];

export const useLogout = () => {
  const reload = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const mutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Clear auth state
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: [Current] });
      toast.success("Logged out");
      reload();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to log out");
    },
  });

  return mutation;
};
