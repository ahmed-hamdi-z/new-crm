import { useQuery } from "@tanstack/react-query";
import { getMembersInWorkspaceApi } from "../../apis";

const useGetWorkspaceMembers = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getMembersInWorkspaceApi(workspaceId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  return query;
};

export default useGetWorkspaceMembers;