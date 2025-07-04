import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import SessionItem from "./session-item";
import { deleteSessionApi } from "../apis";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import useGetAllSessions from "../hooks/useGetAllSessions";
import AuthCard from "./auth-card";

const Sessions = () => {
  const { data, isLoading, refetch } = useGetAllSessions();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteSessionApi,
  });

  const sessions = data?.sessions || [];

  const currentSession = sessions?.find((session) => session.isCurrent);
  const othersSessions = sessions?.filter(
    (session) => session.isCurrent !== true
  );
  const handleDelete = useCallback(
    (id: string) => {
      mutate(id, {
        onSuccess: () => {
          refetch();
          toast.success("session deleted");
        },
        onError: (error) => {
          console.log(error);
          toast.error("faild to delete session");
        },
      });
    },
    [mutate, refetch]
  );

  return (
    <AuthCard
      title="Sessions"
      description="Sessions are the devices you are using or that have used your click
          These are the sessions where your account is currently logged in. You
          can log out of each session."
      className="via-root to-root rounded-xl bg-gradient-to-r p-0.5"
    >
      <div className="rounded-[10px]">
        {isLoading ? (
          <Loader size="35px" className="animate-spin" />
        ) : (
          <div className="rounded-t-xl">
            <div>
              <h5 className="text-base font-semibold text-center">
                Current active session
              </h5>
              <p className="mb-6 text-sm text-center text-[#0007149f] dark:text-gray-100">
                You’re logged into this click account on this device and are
                currently using it.
              </p>
            </div>
            <div className="w-full ">
              {currentSession && (
                <div className="w-full py-2 border-b pb-5 ">
                  <SessionItem
                    userAgent={currentSession.userAgent}
                    date={currentSession.createdAt}
                    expiresAt={currentSession.expiresAt}
                    isCurrent={currentSession.isCurrent}
                  />
                </div>
              )}
              <div className="mt-4">
                <h5 className="text-base font-semibold">Other sessions</h5>
                <ul className="w-full mt-4 space-y-3  max-h-[400px] overflow-y-auto">
                  {othersSessions?.map((session) => (
                    <li key={session._id}>
                      <SessionItem
                        loading={isPending}
                        userAgent={session.userAgent}
                        expiresAt={session.expiresAt}
                        date={session.createdAt}
                        onRemove={() => handleDelete(session._id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthCard>
  );
};

export default Sessions;
