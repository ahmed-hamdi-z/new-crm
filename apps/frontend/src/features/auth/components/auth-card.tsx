import React, { useMemo } from "react";
import { Link } from "react-router";
import { MailCheckIcon, ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useResponsiveDesign } from "@/hooks/shared/useMediaQuery";
import AUTH_ROUTES from "@/features/auth/router/route.path";

interface AuthCardProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  isSubmitted?: string | boolean;
  successMessageEmail?: string;
  successMessage?: string;
  goBackToLoginRoute?: string;
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  children,
  isSubmitted = false,
  successMessageEmail,
  successMessage,
  goBackToLoginRoute = AUTH_ROUTES.SIGN_IN,
}) => {
  const { prefersReducedMotion } = useResponsiveDesign();

  const animationClass = useMemo(
    () => (prefersReducedMotion ? "" : "animate-fadeIn"),
    [prefersReducedMotion]
  );

  return (
    <Card
      className={`w-full h-full md:w-[487px] py-5 shadow-sm shadow-slate-400 ${animationClass}`}
    >
      {!isSubmitted ? (
        <>
          <CardHeader className="flex items-center justify-center text-center ">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent className="p-7">{children}</CardContent>
        </>
      ) : (
        <div className="w-full flex flex-col gap-2 items-center justify-center rounded-md">
          <div className="size-[48px]">
            <MailCheckIcon size="48px" className="animate-bounce" />
          </div>
          <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
            Check your email
          </h2>
          <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
            {successMessage ||
              `We just sent a verification link to ${
                successMessageEmail || "your email"
              }.`}
          </p>
          <Link to={goBackToLoginRoute}>
            <Button className="h-[40px]">
              Go to login
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default React.memo(AuthCard);
