import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyMFALoginApi } from "../apis";
import { useNavigate, useSearchParams } from "react-router";
import { UserResponseType } from "../types";

export const useVeriftMfaLogin = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const navigate = useNavigate();

  const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;

  const mutation = useMutation({
    mutationFn: verifyMFALoginApi,

    onSuccess: (data: UserResponseType) => {
      queryClient.resetQueries({
        queryKey: ["authUser"],
      });
      toast.success(data.message || "Logged in successfully");
      return navigate(
        decodedUrl || `/workspace/${data?.user?.currentWorkspace}`
      );
    },

    onError: (error: Error) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });

  return mutation;
};
