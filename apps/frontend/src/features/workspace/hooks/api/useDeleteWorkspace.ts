import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkspaceApi } from "../../apis";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: deleteWorkspaceApi,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["userWorkspaces"],
      });
      navigate(`/workspace/${data.currentWorkspace}`);
      toast.success("Workspace deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete workspace");
    },
  });

  return mutation;
};

export default useDeleteWorkspace;
