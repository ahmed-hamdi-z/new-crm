import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyEmailApi } from "../apis";
import { useNavigate } from "react-router";
export const useConfirmAccount = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: verifyEmailApi,

    onSuccess: () => {
      toast.success("Account confirmed successfully");
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to confirm account");
    },
  });

  return mutation;
};
