import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitedUserJoinWorkspaceApi } from "../../apis";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const useInviteUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: invitedUserJoinWorkspaceApi,
    onSuccess: (data) => {
      queryClient.resetQueries({
        queryKey: ["userWorkspaces"],
      });
      navigate(`/workspace/${data.workspaceId}`);
      toast.success("Workspace joined successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to join workspace");
    },
  });

  return mutation;
};

export default useInviteUser;
