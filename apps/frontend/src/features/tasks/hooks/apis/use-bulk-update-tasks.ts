import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkUpdateTaskStatusApi } from "../../apis";

export const useBulkUpdateTasks = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: bulkUpdateTaskStatusApi,

    onSuccess: () => {
      toast.success("Tasks updated");

      queryClient.invalidateQueries({
        queryKey: ["project-analytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-analytics", workspaceId],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to update tasks");
    },
    
  });

  return mutation;
};
