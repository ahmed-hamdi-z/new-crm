import { useQuery } from "@tanstack/react-query";
import { getSessions } from "@/api/authentication-api";
import { SESSIONS } from "@/constants/shared";

const useSessions = (opts = {}) => {
  const { data: sessions = [], ...rest } = useQuery({
    queryKey: [SESSIONS],
    queryFn: getSessions,
    ...opts,
  });

  return { sessions, ...rest };
};
export default useSessions;