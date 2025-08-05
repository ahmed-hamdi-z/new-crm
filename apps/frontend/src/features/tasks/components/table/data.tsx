import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  HelpCircle,
  Timer,
  View,
} from "lucide-react";
import { TaskPriorityEnum, TaskStatus } from "../../types";
import { transformOptions } from "@/config/helpers";

const statusIcons = {
  [TaskStatus.BACKLOG]: HelpCircle,
  [TaskStatus.TODO]: Circle,
  [TaskStatus.IN_PROGRESS]: Timer,
  [TaskStatus.IN_REVIEW]: View,
  [TaskStatus.DONE]: CheckCircle,
};

const priorityIcons = {
  [TaskPriorityEnum.LOW]: ArrowDown,
  [TaskPriorityEnum.MEDIUM]: ArrowRight,
  [TaskPriorityEnum.HIGH]: ArrowUp,
};

export const statuses = transformOptions(
  Object.values(TaskStatus),
  statusIcons
);

export const priorities = transformOptions(
  Object.values(TaskPriorityEnum),
  priorityIcons
);