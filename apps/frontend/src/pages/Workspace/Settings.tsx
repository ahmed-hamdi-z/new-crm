import PermissionsGuard from "@/components/shared/permission-guard";
import { Separator } from "@/components/ui/separator";
import { Permissions } from "@/constants/permissions";
import DeleteWorkspaceCard from "@/features/workspace/components/delete-workspace";
import EditWorkspaceForm from "@/features/workspace/components/edit-workspace-form";
import WorkspaceHeader from "@/features/workspace/components/workspace-header";

const Settings = () => {
  return (
    <PermissionsGuard
      showMessage
      requiredPermission={Permissions.MANAGE_WORKSPACE_SETTINGS}
    >
      <div className="w-full h-auto py-2">
        <WorkspaceHeader />
        <Separator className="my-4 " />
        <main>
          <div className="w-full max-w-3xl mx-auto py-3">
            <h2 className="text-[20px] leading-[30px] font-semibold mb-3">
              Workspace settings
            </h2>

            <div className="flex flex-col pt-0.5 px-0 ">
              <div className="pt-2">
                <EditWorkspaceForm />
              </div>
              <div className="pt-2">
                <DeleteWorkspaceCard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </PermissionsGuard>
  );
};

export default Settings;
