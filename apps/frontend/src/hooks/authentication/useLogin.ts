import { loginApi } from "../../api/authentication-api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router";

export const useLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const redirectUrl = location.state?.redirectUrl || "/dashboard";

  const mutation = useMutation({
    mutationFn: loginApi, 
    onSuccess: () => {
      toast.success("Logged in successfully");
      navigate(redirectUrl , { replace: true }); 
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to login");
    },
  });

  return mutation;
};