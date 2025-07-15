import { useQuery } from "@tanstack/react-query";
import { getWorkspaceAnalyticsApi } from "../../apis";

const useGetWorkspaceAnalytics = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: () => getWorkspaceAnalyticsApi(workspaceId),
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: !!workspaceId,
  });

  return query;
};

export default useGetWorkspaceAnalytics;
