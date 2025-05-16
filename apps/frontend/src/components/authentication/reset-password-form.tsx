import { useState } from "react";
import { Link } from "react-router";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/authentication/useResetPassword";
import { appRoutes } from "@/constants/app-routes";

const ResetPasswordForm = ({ code }: { code: string }) => {
  const [password, setPassword] = useState("");

  const {
    mutate: resetUserPassword,
    isPending,
    isSuccess,
  } = useResetPassword();

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Change your password
      </h1>
      <div className="bg-muted/40 py-3">
        {isSuccess ? (
          <>
            <Alert variant="default" className="mb-4">
              <AlertTitle className="text-center">
                Password updated successfully!
              </AlertTitle>
            </Alert>
            <Link to={appRoutes.auth.login} replace className="link-btn">
              Sign in
            </Link>
          </>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetUserPassword({
                password,
                verificationCode: code,
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    resetUserPassword({ password, verificationCode: code });
                  }
                }}
                autoFocus
              />
            </div>
            <Button
              type="submit"
              disabled={password.length < 6 || isPending}
              className="w-full"
            >
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
