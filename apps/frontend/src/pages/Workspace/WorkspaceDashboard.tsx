import EnableMfa from "@/features/auth/components/enable-mfa";
import Sessions from "@/features/auth/components/sessions";
import WorkspaceLayout from "@/layouts/workspace-layout";

const WorkspaceDashboard: React.FC = () => {
  return (
    <WorkspaceLayout>
      <EnableMfa />
      <Sessions />
    </WorkspaceLayout>
  );
};

export default WorkspaceDashboard;
