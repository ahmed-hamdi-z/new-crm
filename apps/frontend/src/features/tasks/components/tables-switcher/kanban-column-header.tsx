import React from "react";
import {
  CircleDotIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleIcon,
} from "lucide-react";

import { TaskStatusEnum, TaskStatusEnumType } from "../../types";
import { snakeCaseToTitleCase } from "@/lib/utils";

interface KanbanColumnHeaderProps {
  board: TaskStatusEnumType;
  taskCount: number;
}

const statusIconMap: Record<TaskStatusEnumType, React.ReactNode> = {
  [TaskStatusEnum.BACKLOG]: (
    <CircleDashedIcon className="size=[18px] text-pink-400" />
  ),
  [TaskStatusEnum.TODO]: <CircleIcon className="size=[18px] text-rose-400" />,
  [TaskStatusEnum.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size=[18px] text-yellow-400" />
  ),
  [TaskStatusEnum.IN_REVIEW]: (
    <CircleDotIcon className="size=[18px] text-blue-400" />
  ),
  [TaskStatusEnum.DONE]: (
    <CircleCheckIcon className="size=[18px] text-emerald-400" />
  ),
};

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const icon = statusIconMap[board];


  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </div>
      </div>
  
    </div>
  );
};
