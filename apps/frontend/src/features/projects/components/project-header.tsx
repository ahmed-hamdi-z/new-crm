import { useParams } from "react-router";
// import CreateTaskDialog from "../task/create-task-dialog";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useWorkspaceId from "@/features/workspace/hooks/client/useWorkspaceId";
import { getProjectByIdApi } from "../apis";
import PermissionsGuard from "@/components/shared/permission-guard";
import { Permissions } from "@/constants/permissions";
import EditProjectDialog from "./edit-project";

const ProjectHeader = () => {
  const param = useParams();
  const projectId = param.projectId as string;

  const workspaceId = useWorkspaceId();

  const { data, isPending, isError } = useQuery({
    queryKey: ["singleProject", projectId],
    queryFn: () =>
      getProjectByIdApi({
        workspaceId,
        projectId,
      }),
    staleTime: Infinity,
    enabled: !!projectId,
    placeholderData: keepPreviousData,
  });

  const project = data?.project;

  // Fallback if no project data is found
  const projectEmoji = project?.emoji || "📊";
  const projectName = project?.name || "Untitled project";

  const renderContent = () => {
    if (isPending) return <span>Loading...</span>;
    if (isError) return <span>Error occured</span>;
    return (
      <>
        <span>{projectEmoji}</span>
        {projectName}
      </>
    );
  };
  return (
    <div className="flex items-center justify-between space-y-2">
      <div className="flex items-center gap-2">
        <h2 className="flex items-center gap-3 text-xl font-medium truncate tracking-tight">
          {renderContent()}
        </h2>
        <PermissionsGuard requiredPermission={Permissions.EDIT_PROJECT}>
          <EditProjectDialog project={project} />
        </PermissionsGuard>
      </div>
      {/* <CreateTaskDialog projectId={projectId} /> */}
    </div>
  );
};

export default ProjectHeader;