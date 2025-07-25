import { PaginationType } from "@/features/workspace/types";

export const TaskStatusEnum = {
  BACKLOG: "BACKLOG",
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  DONE: "DONE",
} as const;

export const TaskPriorityEnum = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;
export type TaskStatusEnumType = keyof typeof TaskStatusEnum;
export type TaskPriorityEnumType = keyof typeof TaskPriorityEnum;

export type CreateTaskPayloadType = {
  workspaceId: string;
  projectId: string;
  data: {
    title: string;
    description: string;
    priority: TaskPriorityEnumType;
    status: TaskStatusEnumType;
    assignedTo: string;
    dueDate: string;
  };
};

export type EditTaskPayloadType = {
  taskId: string;
  workspaceId: string;
  projectId: string;
  data: Partial<{
    title: string;
    description: string;
    priority: TaskPriorityEnumType;
    status: TaskStatusEnumType;
    assignedTo: string;
    dueDate: string;
  }>;
};

export type TaskType = {
  position: number;
  _id: string;
  title: string;
  description?: string;
  project?: {
    _id: string;
    emoji: string;
    name: string;
  };
  priority: TaskPriorityEnumType;
  status: TaskStatusEnumType;
  assignedTo: {
    _id: string;
    name: string;
    profilePicture: string | null;
  } | null;
  createdBy?: string;
  dueDate: string;
  taskCode: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AllTaskPayloadType = {
  workspaceId: string;
  projectId?: string | null;
  keyword?: string | null;
  priority?: TaskPriorityEnumType | null;
  status?: TaskStatusEnumType | null;
  assignedTo?: string | null;
  dueDate?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
  position?: number | null;
};

export type AllTaskResponseType = {
  message: string;
  tasks: TaskType[];
  pagination: PaginationType;
};

export type BulkUpdateTaskPayloadType = {
  workspaceId: string;
  id: string;
  status: TaskStatusEnumType;
  position: number;
  tasks: Array<TaskType>;
};

export type BulkUpdateTaskResponseType = {
  message: string;
  updatedCount: number;
  tasks: TaskType;
};

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = Document & {
  _id: string;
  title: string;
  status: TaskStatus;
  workspaceId: string;
  assignedTo: string;
  projectId: string;
  position: number;
  dueDate: string;
  description: string;
   project?: {
    _id: string;
    emoji: string;
    name: string;
  };
};
