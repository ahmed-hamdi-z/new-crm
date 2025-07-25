import queryClient from "@/config/query-client";
import { Current } from "@/constants/shared";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { logoutApi } from "../apis";


export const useLogout = () => {
  const reload = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  const mutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
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
