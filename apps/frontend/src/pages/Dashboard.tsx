import  CreateWorkspaceForm  from "@/components/dashboard/create-workspace-form";
import { UserButton } from "@/components/dashboard/user-button";
import DashboardLayout from "@/layouts/dashboard";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <UserButton />
      <div className="h-full bg-red-500 p-4">
        <CreateWorkspaceForm />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
