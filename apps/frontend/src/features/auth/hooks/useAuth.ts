import { useQuery } from "@tanstack/react-query";
import { getUserSessionApi } from "../apis";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getUserSessionApi,
    staleTime: Infinity,
  });
  return query;
};

export default useAuth;
