import { cn } from "@/lib/utils";

import useWorkspaceId from "@/features/workspace/hooks/client/useWorkspaceId";
import { TaskStatusEnum, TaskStatusEnumType } from "../../types";
import { MemberAvatar } from "./member-avatar";
import { useNavigate } from "react-router";
import { ProjectAvatar } from "./project-avatar";
import { ProjectType } from "@/features/projects/types";

interface EventCardProps {
  title: string;
  assigned?: string;
  project: ProjectType;
  status: TaskStatusEnumType;
  id: string;
}

const statusColorMap: Record<TaskStatusEnumType, string> = {
  [TaskStatusEnum.BACKLOG]: "border-l-pink-500",
  [TaskStatusEnum.TODO]: "border-l-red-500",
  [TaskStatusEnum.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatusEnum.IN_REVIEW]: "border-l-blue-500",
  [TaskStatusEnum.DONE]: "border-l-emerald-500",
};

export const EventCard = ({
  title,
  project,
  status,
  id,
}: EventCardProps) => {
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="px-2">
      <div
        onClick={onClick}
        className={cn(
          "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name="zidan" />
          <div className="dot" />
          <ProjectAvatar name={project?.name} image={project?.createdBy?.profilePicture} />
        </div>
      </div>
    </div>
  );
};
