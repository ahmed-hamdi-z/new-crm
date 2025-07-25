import { useQuery } from "@tanstack/react-query";
import { getAllTasksApi } from "../../apis";
import { TaskStatus } from "../../types";

interface useGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  assignedTo?: string | null;
  dueDate?: string | null;
  filters?: string[];
  pageSize?: number;
  pageNumber?: number;
  priority?: string[];
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  search,
  assignedTo,
  dueDate,
  pageSize,
  pageNumber
}: useGetTasksProps) => {
  const query = useQuery({
   queryKey: [
      "all-tasks",
      workspaceId,
      pageSize,
      status,
      pageNumber,
      search,
      projectId,
    ],
    queryFn: async () => {
      const response = getAllTasksApi({
        workspaceId,
        projectId: projectId ?? undefined,
        status: status ?? undefined,
        assignedTo: assignedTo ?? undefined,
        dueDate: dueDate ?? undefined,
        keyword: search ?? undefined,
        pageNumber,
        pageSize
      });

      if (!response) {
        throw new Error("Failed to fetch tasks");
      }

      const { data } = await response;

      return data;
    },
  });

  return query;
};
