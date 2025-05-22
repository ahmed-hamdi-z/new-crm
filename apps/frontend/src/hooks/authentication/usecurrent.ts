import { Current } from "@/constants/shared";
import { CurrentUser } from "../../api/authentication-api";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../types/user";

const useCurrent = (opts = {}) => {
  const { data: user, ...rest } = useQuery<User>({
    queryKey: [Current],
    queryFn: CurrentUser as any,
    staleTime: Infinity,
    ...opts,
  });

  return {
    user,
    ...rest,
  };
};

export default useCurrent;
