import { DottedSeparator } from "@/components/shared/dotted-separator";
import AllMembers from "@/features/workspace/components/all-members";
import InviteMember from "@/features/workspace/components/invite-member";
import WorkspaceHeader from "@/features/workspace/components/workspace-header";

const Members = () => {
  return (
    <div className="w-full h-auto pt-2">
      <WorkspaceHeader />
      <main className="my-4">
        <div className="w-full max-w-3xl mx-auto pt-3">
          <div>
            <h2 className="text-lg leading-[30px] font-semibold mb-1">
              Workspace members
            </h2>
            <p className="text-sm text-muted-foreground">
              Workspace members can view and join all Workspace project, tasks
              and create new task in the Workspace.
            </p>
          </div>
          <DottedSeparator className="my-4" />

          <InviteMember />
          <DottedSeparator className="my-4 !h-[0.5px]" />

          <AllMembers />
        </div>
      </main>
    </div>
  );
};

export default Members;
