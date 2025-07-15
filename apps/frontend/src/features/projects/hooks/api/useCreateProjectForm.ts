import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { createProjectApi } from "../../apis";
import useWorkspaceId from "@/features/workspace/hooks/client/useWorkspaceId";

const useCreateProjectForm = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();

  const mutation = useMutation({
    mutationFn: createProjectApi,

    onSuccess: (data) => {
      const project = data.project;
      queryClient.invalidateQueries({
        queryKey: ["allprojects", workspaceId],
      });

      toast.success(data.message || "Project created successfully");

      navigate(`/workspace/${workspaceId}/project/${project._id}`);
      setTimeout(() => onClose(), 500);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  return mutation;
};

export default useCreateProjectForm;
