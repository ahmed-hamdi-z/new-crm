import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ResetPassword } from "@/api/authentication-api";

export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: ResetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password");
    },
  });
  
  return mutation;
};
