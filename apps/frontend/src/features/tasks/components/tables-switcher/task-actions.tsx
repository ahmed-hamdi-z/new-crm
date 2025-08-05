import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useWorkspaceId from "@/features/workspace/hooks/client/useWorkspaceId";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { TaskType } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteTaskApi } from "../../apis";
import { toast } from "sonner";
import { PencilIcon } from "lucide-react";

interface TaskActionsProps {
  id: string;
  projectId?: string;
  children: React.ReactNode;
  task?: TaskType;
}

export const TaskActions = ({ children, task }: TaskActionsProps) => {
  const [openDeleteDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false); // State for edit dialog

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTaskApi,
  });

  const taskId = task?._id as string;
  const taskCode = task?.taskCode;
  const handleConfirm = () => {
    mutate(
      { workspaceId, taskId },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["all-tasks", workspaceId],
          });
          toast.success(data?.message || "Task deleted successfully");
          setTimeout(() => setOpenDialog(false), 100);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete task");
        },
      }
    );
  };

  return (
    <div className="flex justify-end">
      
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white">
          <DropdownMenuItem
            onClick={() => openEditDialog}
            onChange={() => setOpenEditDialog(true)}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
         {/* EditTask
          <EditTask
            task={task as TaskType}
            isOpen={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
          /> */}

          <DropdownMenuItem
            className="!text-destructive cursor-pointer"
            onClick={() => setOpenDialog(true)}
          >
            Delete Task
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ConfirmDialog
        isOpen={openDeleteDialog}
        isLoading={isPending}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
        title="Delete Task"
        description={`Are you sure you want to delete ${taskCode}?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};
