import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { Loader } from "lucide-react";
import { PropsWithChildren } from "react";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { data, isLoading } = useAuth();
  const user = data?.data?.user;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[rgba(255,255,255,.2)] text-2xl">
        <Loader size="30px" className="animate-spin" />
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
