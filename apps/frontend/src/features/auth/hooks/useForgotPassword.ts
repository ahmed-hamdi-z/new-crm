import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPasswordApi } from "../apis";
export const useForgotPassword = () => {
  const mutation = useMutation({
    mutationFn: forgotPasswordApi,

    onSuccess: () => {
      toast.success("Email sent successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send email");
    },
  });

  return mutation;
};
