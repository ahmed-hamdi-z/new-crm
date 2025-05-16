import { Card, CardContent } from "@/components/ui/card";

import { Link, useSearchParams } from "react-router";
import { appRoutes } from "@/constants/app-routes";
import { Alert } from "../ui/alert";
import ResetPasswordForm from "./reset-password-form";
import { AlertCircle } from "lucide-react";

/**
 * Renders a reset password card with an alert message if the link is invalid or expired, and a reset password form if the link is valid.
 * The link is valid if code and exp query parameters are present and the expiration time is later than the current time.
 * @returns A JSX element representing the reset password card.
 */

const ResetPasswordCard = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();

  const linkIsValid = code && exp && exp > now;

  return (
    <Card className="w-full h-full md:w-[487px] shadow-sm shadow-slate-400">
      {linkIsValid ? (
        <ResetPasswordForm code={code} />
      ) : (
        <CardContent className="pt-3 flex flex-col items-center justify-center">
          <Alert
            className="flex items-center justify-center"
            variant="destructive"
          >
            <AlertCircle className="w-5 h-5 " />
            <span className="">Invalid Link</span>
          </Alert>
          <p className="py-3">The link has expired or is invalid</p>
          <Link className="link-btn" to={appRoutes.auth.forgotPassword}>
            <span className=" ">&nbsp;Request a new password reset link</span>
          </Link>
        </CardContent>
      )}
    </Card>
  );
};

export default ResetPasswordCard;
