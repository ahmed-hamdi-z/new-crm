import  CreateWorkspaceForm  from "@/components/dashboard/create-workspace-form";
import { UserButton } from "@/components/dashboard/user-button";

const Dashboard = () => {
  return (
    <div>
      <UserButton />
      <div className="h-full bg-red-500 p-4">
        <CreateWorkspaceForm />
      </div>
    </div>
  );
};

export default Dashboard;