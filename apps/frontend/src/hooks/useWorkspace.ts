
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { createWorkspaceApi } from "@/api/workspace-api";
import { appRoutes } from "@/constants/app-routes";

export const useCreateWorkspace = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createWorkspaceApi,
    onSuccess: (data: any) => {
      toast.success("Workspace created successfully");
      navigate(`${appRoutes.workspace.path}/${data.workspace._id}`, { 
        replace: true 
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create workspace");
    },
  });

  return mutation;
};