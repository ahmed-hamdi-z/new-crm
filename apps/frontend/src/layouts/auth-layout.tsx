import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router";
import { PropsWithChildren } from "react";
import AUTH_ROUTES from "@/features/auth/router/route.path";

const AuthLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const isLogin = location.pathname === AUTH_ROUTES.SIGN_IN;

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <img src="/logo.svg" width={100} height={50} alt="Logo" />
          <Button asChild variant="secondary">
            <Link to={isLogin ? AUTH_ROUTES.SIGN_UP : AUTH_ROUTES.SIGN_IN}>
              {isLogin ? "Sign Up" : "Sign In"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
