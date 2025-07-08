import EnableMfa from "@/features/auth/components/enable-mfa";
import Sessions from "@/features/auth/components/sessions";

const WorkspaceDashboard: React.FC = () => {
  return (
    <div>
      <EnableMfa />
      <Sessions />
    </div>
  );
};

export default WorkspaceDashboard;
