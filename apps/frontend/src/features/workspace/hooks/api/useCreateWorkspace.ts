import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspaceApi } from "../../apis";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const useCreateWorkspace = ({ onClose }: { onClose?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: createWorkspaceApi,

    onSuccess: (data) => {
      queryClient.resetQueries({
        queryKey: ["userWorkspaces"],
      });
      const workspace = data.workspace;
     setTimeout(() => onClose?.(), 100);
      navigate(`/workspace/${workspace._id}`);
      toast.success("Workspace created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create workspace");
    },
  });

  return mutation;
};

export default useCreateWorkspace;
