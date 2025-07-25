import { useAuthContext } from "@/features/auth/auth.provider";
import useWorkspaceId from "../hooks/client/useWorkspaceId";
import PermissionsGuard from "@/components/shared/permission-guard";
import { Permissions } from "@/constants/permissions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import useConfirmDialog from "@/hooks/shared/useConfirmDialog";
import useDeleteWorkspace from "../hooks/api/useDeleteWorkspace";

const DeleteWorkspaceCard = () => {
  const { workspace } = useAuthContext();
  const workspaceId = useWorkspaceId();
  const { open, onOpenDialog, onCloseDialog } = useConfirmDialog();
  const { mutate, isPending } = useDeleteWorkspace();

  const handleConfirm = () => {
    mutate(workspaceId);
  };
  return (
    <>
      <div className="w-full">
        <div className="mb-5 border-b">
          <h1
            className="text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left"
          >
            Delete Workspace
          </h1>
        </div>

        <PermissionsGuard
          showMessage
          requiredPermission={Permissions.DELETE_WORKSPACE}
        >
          <div className="flex flex-col items-start justify-between py-0">
            <div className="flex-1 mb-2">
              <p>
                Deleting a workspace is a permanent action and cannot be undone.
                Once you delete a workspace.
              </p>
            </div>
            <Button
              className="shrink-0 flex place-self-end h-[40px] bg-slate-800 hover:bg-slate-700 text-white rounded-md px-4 py-2"
              variant="destructive"
              onClick={onOpenDialog}
            >
              Delete Workspace
            </Button>
          </div>
        </PermissionsGuard>
      </div>

      <ConfirmDialog
        isOpen={open}
        isLoading={isPending}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title={`Delete  ${workspace?.name} Workspace`}
        description={`Are you sure you want to delete?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default DeleteWorkspaceCard;
