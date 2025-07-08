import { useQuery } from "@tanstack/react-query";
import { getWorkspaceByIdApi } from "../../apis";
import { ErrorCode } from "@/types/error-code";

const useGetWorkspaceById = (workspaceId: string) => {
  const query = useQuery<any, ErrorCode>({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdApi(workspaceId),
    staleTime: 0,
    retry: 2,
    enabled: !!workspaceId,
  });

  return query;
};

export default useGetWorkspaceById;