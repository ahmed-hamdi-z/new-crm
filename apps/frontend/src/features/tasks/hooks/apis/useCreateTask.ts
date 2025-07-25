import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskApi } from "../../apis";

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createTaskApi,

    onSuccess: () => {
      toast.success("Task created");

      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });

  return mutation;
};
