import { DottedSeparator } from "@/components/shared/dotted-separator";
import { MemberAvatar } from "./member-avatar";
import { ProjectAvatar } from "./project-avatar";
import { TaskType } from "../../types";
import { TaskDate } from "./task-date";
import { DataTableRowActions } from "../table/table-row-actions";

interface KanbanCardProps {
  task: TaskType;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-md space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.title}</p>
        <DataTableRowActions tasks={task} />
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task.assignedTo?.name}
          fallbackClassName="text-[10px]"
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <p>{task.description}</p>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.project?.name}
          image={task.createdBy}
          fallbackClassName="text-[10px]"
        />
        <span className="text-xs font-medium">{task?.project?.name}</span>
      </div>
    </div>
  );
};
