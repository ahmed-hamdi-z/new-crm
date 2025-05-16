import { PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import useCurrent from "@/hooks/authentication/usecurrent";
import { appRoutes } from "@/constants/app-routes";
import { toast } from "sonner";
import Loader from "@/components/global/loader";

/**
 * A protected route component that requires the user to be logged in to access
 * the child component. If the user is not logged in, it will redirect to the
 * login page and display an error message.
 *
 * @param children The React child component to render if the user is logged in.
 * @returns The rendered child component if the user is logged in, otherwise a
 *          redirect to the login page with an error message.
 */
const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useCurrent();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    const errorMessage = toast.error(
      "You must be logged in to access this page."
    );
    navigate(appRoutes.auth.login);
    return errorMessage;
  }

  return children;
};

export default ProtectedRoute;
