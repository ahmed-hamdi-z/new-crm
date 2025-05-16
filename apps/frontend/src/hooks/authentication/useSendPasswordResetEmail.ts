import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SendPasswordResetEmailApi } from "@/api/authentication-api";
export const useSendPasswordResetEmail = () => {

  const mutation = useMutation({
    mutationFn: SendPasswordResetEmailApi,
    onSuccess: () => {
      toast.success("Email sent successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send email");
    },
  });

  return mutation;
};
