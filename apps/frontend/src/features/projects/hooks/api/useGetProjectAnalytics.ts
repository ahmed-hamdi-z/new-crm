import { useQuery } from "@tanstack/react-query";
import { getProjectAnalyticsApi } from "../../apis";

const useGetProjectAnalytics = (projectId: string, workspaceId: string) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: () => getProjectAnalyticsApi({ workspaceId, projectId }),
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: !!projectId,
  });
  return query;
};

export default useGetProjectAnalytics;
