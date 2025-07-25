import CreateTask from "@/features/tasks/components/create-task";
import {TaskViewSwitcher} from "@/features/tasks/components/tables-switcher/task-view-switcher";
// import TaskTable from "@/features/tasks/components/task-table";

export default function Tasks() {
  return (
    <div className="w-full h-full flex-col space-y-8 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
          <p className="text-muted-foreground">
            Here&apos;s the list of tasks for this workspace!
          </p>
        </div>
        <CreateTask newTask="New Task"/>
      </div>
      <div>
       <TaskViewSwitcher />
      </div>
      {/* {Task Table} */}
      {/* <div>
        <TaskTable />
      </div> */}
    </div>
  );
}