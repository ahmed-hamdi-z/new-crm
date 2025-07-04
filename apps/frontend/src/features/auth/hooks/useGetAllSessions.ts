import { useQuery } from "@tanstack/react-query";
import { sessionsApi } from "../apis";

const useGetAllSessions = () => {
  const query = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionsApi,
    staleTime: Infinity,
  });
  return query;
};

export default useGetAllSessions;
