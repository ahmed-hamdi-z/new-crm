import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { TaskPriorityEnum, TaskPriorityEnumType, TaskStatusEnum, TaskStatusEnumType } from "../types";

const useTaskTableFilter = () => {
  return useQueryStates({
    status: parseAsStringEnum<TaskStatusEnumType>(
      Object.values(TaskStatusEnum)
    ),
    priority: parseAsStringEnum<TaskPriorityEnumType>(
      Object.values(TaskPriorityEnum)
    ),
    keyword: parseAsString,
    projectId: parseAsString,
    assigneeId: parseAsString,
  });
};

export default useTaskTableFilter;