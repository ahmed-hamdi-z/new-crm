import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { RegisterApi } from "../../api/authentication-api";
import { appRoutes } from "@/constants/app-routes";

export const useRegister = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: RegisterApi,
    onSuccess: () => {
      toast.success( "Registered successfully");
      navigate(appRoutes.dashboard.path, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register");
    },
  });

  return mutation;
};
