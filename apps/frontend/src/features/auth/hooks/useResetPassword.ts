import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPasswordApi } from "../apis";
import { useNavigate } from "react-router";

export const useResetPassword = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password reset successfully");
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password");
    },
  });

  return mutation;
};
