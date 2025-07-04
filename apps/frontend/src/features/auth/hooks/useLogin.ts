import { loginApi } from "../apis";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { UserResponseType } from "../types";

export const useLogin = () => {
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const navigate = useNavigate();

  const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data: UserResponseType) => {
      if (!data || typeof data !== "object") {
        console.error("Invalid response data:", data);
        toast.error("Login failed. Invalid response.");
        return;
      }

      if (data?.mfaRequired) {
        if (!data.user?.email) {
          console.error("MFA required but no user email:", data);
          toast.error("Login failed. Missing user information.");
          return;
        }
        navigate(`/verify-mfa?email=${data.user.email}`);
        return;
      }

      if (!data.user) {
        console.error("No user data in response:", data);
        toast.error("Login failed. Missing user information.");
        return;
      }

      if (!data.user.currentWorkspace) {
        console.error("No currentWorkspace in user data:", data.user);
        toast.error("Login failed. No workspace assigned.");
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
