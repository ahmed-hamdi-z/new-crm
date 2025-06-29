import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerApi } from "../apis";

export const useRegister = () => {

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success( "Registered successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register");
    },
  });

  return mutation;
};
