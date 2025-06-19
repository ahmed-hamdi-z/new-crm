import { PropsWithChildren, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import useCurrent from "@/hooks/authentication/useCurrent";
import { appRoutes } from "@/constants/app-routes";
import { toast } from "sonner";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useCurrent();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("You must be logged in to access this page.");
      navigate(appRoutes.auth.login, {
        state: { from: location },
        replace: true,
      });
    }
  }, [isLoading, user, navigate, location]);
  
  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;