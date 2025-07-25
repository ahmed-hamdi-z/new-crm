import AnalyticsCard from "./analytics-card";
import useWorkspaceId from "@/features/workspace/hooks/client/useWorkspaceId";
import { useParams } from "react-router";

import useGetProjectAnalytics from "../hooks/api/useGetProjectAnalytics";
const ProjectAnalytics = () => {
  const param = useParams();
  const projectId = param.projectId as string;

  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetProjectAnalytics(projectId, workspaceId);

  const analytics = data?.analytics?.analytics;
  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <AnalyticsCard
        isLoading={isPending}
        title="Total Task"
        value={analytics?.totalTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Overdue Task"
        value={analytics?.overdueTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Completed Task"
        value={analytics?.completedTasks || 0}
      />
    </div>
  );
};

export default ProjectAnalytics;
