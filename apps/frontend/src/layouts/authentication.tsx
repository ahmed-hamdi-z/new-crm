// Components
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/constants/app-routes";
import { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router";

// Main Layout For Authentication
const AuthLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const isLogin = location.pathname === appRoutes.auth.login;

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <img src="/logo.svg" width={100} height={50} alt="Logo" />
          
          <Button asChild variant="secondary">
            <Link to={isLogin ? appRoutes.auth.register : appRoutes.auth.login}>
              {isLogin ? "Sign Up" : "Sign In"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
