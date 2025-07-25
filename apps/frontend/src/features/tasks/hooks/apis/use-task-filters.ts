import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { TaskStatusEnum } from "../../types";


export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatusEnum)),
    assignedId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
