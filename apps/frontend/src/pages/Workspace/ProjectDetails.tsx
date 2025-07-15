import { Separator } from "@/components/ui/separator";
// import TaskTable from "@/components/workspace/task/task-table";
import ProjectAnalytics from "@/features/projects/components/project-analytics";
import ProjectHeader from "@/features/projects/components/project-header";

const ProjectDetails = () => {
  return (
    <div className="w-full space-y-6 py-4 md:pt-3">
      <ProjectHeader />
      <div className="space-y-5">
        <ProjectAnalytics />
        <Separator />
        {/* {Task Table} */}
        {/* <TaskTable /> */}
      </div>
    </div>
  );
};

export default ProjectDetails;