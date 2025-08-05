import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskType } from "../../types";
import useWorkspaceId from "@/features/workspace/hooks/client/useWorkspaceId";
import { deleteTaskApi } from "../../apis";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import EditTask from "../edit-task";

interface DataTableRowActionsProps {
  row?: Row<TaskType>;
  tasks?: TaskType;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [openDeleteDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false); 

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTaskApi,
  });

  const task = row?.original;
  const taskId = task?._id as string;
  const taskCode = task?.taskCode;

  const handleConfirm = () => {
    mutate(
      { workspaceId, taskId },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] bg-white">
          {/* Edit Task Option */}
          <DropdownMenuItem className="cursor-pointer hover:bg-neutral-200" onClick={() => setOpenEditDialog(true)}>
            <Pencil className="w-4 h-4 mr-2" /> Edit Task
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Delete Task Option */}
          <DropdownMenuItem
            className="!text-destructive cursor-pointer hover:bg-neutral-200"
            onClick={() => setOpenDialog(true)}
          >
            Delete Task
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Task Dialog */}
      <EditTask task={task as TaskType} isOpen={openEditDialog} onClose={() => setOpenEditDialog(false)} />

      {/* Delete Task Confirmation Dialog */}
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
    </>
  );
}