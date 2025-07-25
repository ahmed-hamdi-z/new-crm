import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { editProjectApi } from "../../apis";
import useWorkspaceId from "@/features/workspace/hooks/client/useWorkspaceId";

const useEditProjectForm = (
  { onClose }: { onClose: () => void },
  projectId: string
) => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const mutation = useMutation({
    mutationFn: editProjectApi,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["singleProject", projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["allprojects", workspaceId],
      });

      toast.success(data?.message || "Project updated successfully");

      setTimeout(() => onClose(), 100);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update project");
    },
  });
  return mutation;
};

export default useEditProjectForm;
