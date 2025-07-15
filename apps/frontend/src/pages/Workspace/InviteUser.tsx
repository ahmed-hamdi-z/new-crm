import { Loader } from "lucide-react";
import { Link, useParams } from "react-router";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuth from "@/features/auth/hooks/useAuth";
import BASE_ROUTE from "@/features/home/router/route.path";
import AuthCard from "@/features/auth/components/auth-card";
import useInviteUser from "@/features/workspace/hooks/api/useInviteUser";

const InviteUser = () => {
  const param = useParams();
  const inviteCode = param.inviteCode as string;

  const { data: authData, isPending } = useAuth();
  const user = authData?.data?.user;

  const { mutate, isPending: isLoading } = useInviteUser();

  const returnUrl = encodeURIComponent(
    `${BASE_ROUTE.INVITE_URL.replace(":inviteCode", inviteCode)}`
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    mutate(inviteCode, {});
  };

  return (
    <div className="min-h-screen my-auto flex items-center justify-center ">
      <AuthCard
        title="Hey there! You're invited to join a click Workspace!"
        description="  Looks like you need to be logged into your click account to
                join this Workspace."
      >
        <CardContent>
          {isPending ? (
            <Loader className="!w-11 !h-11 animate-spin place-self-center flex" />
          ) : (
            <div>
              {user ? (
                <div className="flex items-center justify-center ">
                  <form onSubmit={handleSubmit}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="!bg-green-500 !text-white text-[23px] !h-auto -my-4"
                    >
                      {isLoading && (
                        <Loader className="!w-6 !h-6 animate-spin" />
                      )}
                      Join the Workspace
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <Link
                    className="flex-1 w-full text-base"
                    to={`/register?returnUrl=${returnUrl}`}
                  >
                    <Button className="w-full">Signup</Button>
                  </Link>
                  <Link
                    className="flex-1 w-full text-base"
                    to={`login/?returnUrl=${returnUrl}`}
                  >
                    <Button variant="secondary" className="w-full border">
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </AuthCard>
    </div>
  );
};

export default InviteUser;
