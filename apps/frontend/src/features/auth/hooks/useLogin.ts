import { loginApi } from "../apis";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { LoginResponseType } from "../types";

export const useLogin = () => {
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const navigate = useNavigate();

  const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data: LoginResponseType) => {
      if (data?.mfaRequired) {
        navigate(`/verify-mfa?email=${data.user.email}`);
        return;
      }

      toast.success(data.message || "Logged in successfully");
      return navigate(decodedUrl || `/workspace/${data.user.currentWorkspace}`);
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    },
  });

  return mutation;
};
