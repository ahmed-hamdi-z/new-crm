import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editWorkspaceApi } from "../../apis";
import { toast } from "sonner";

const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editWorkspaceApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace"],
      });
      queryClient.invalidateQueries({
        queryKey: ["userWorkspaces"],
      });
      toast.success("Workspace updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update workspace");
    },
  });

  return mutation;
};

export default useUpdateWorkspace;
