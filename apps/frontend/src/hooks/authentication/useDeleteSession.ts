import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession } from "@/api/authentication-api";
import { SESSIONS } from "@/constants/shared";


const useDeleteSession = (sessionId: string) => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.setQueryData([SESSIONS], (cache: string[]) =>
        cache.filter((session: any) => session._id !== sessionId)
      );
    },
  });

  return { deleteSession: mutate, ...rest };
};

export default useDeleteSession;