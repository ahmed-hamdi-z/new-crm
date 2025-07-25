import { Separator } from "@/components/ui/separator";
import ProjectAnalytics from "@/features/projects/components/project-analytics";
import ProjectHeader from "@/features/projects/components/project-header";
import TaskTable from "@/features/tasks/components/task-table";

const ProjectDetails = () => {
  return (
    <div className="w-full space-y-6 py-4 md:pt-3">
      <ProjectHeader />
      <div className="space-y-5">
        <ProjectAnalytics />
        <Separator />
        {/* {Task Table} */}
        <TaskTable />
      </div>
    </div>
  );
};

export default ProjectDetails;