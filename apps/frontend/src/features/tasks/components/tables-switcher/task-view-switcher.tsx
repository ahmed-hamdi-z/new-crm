import { useCallback, useState } from "react";
import { useQueryState } from "nuqs";
import { Loader } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DataKanban } from "./data-kanban";
import { DataFilters } from "./data-filters";
import { DataCalendar } from "./data-calendar";

import useWorkspaceId from "@/features/workspace/hooks/client/useWorkspaceId";

import { useBulkUpdateTasks } from "../../hooks/apis/use-bulk-update-tasks";
import { DottedSeparator } from "@/components/shared/dotted-separator";
import { DataTable } from "../table/table";
import { getAllTasksApi } from "../../apis";
import { useQuery } from "@tanstack/react-query";
import useTaskTableFilter from "../../hooks/useTaskTableFilter";
import { getColumns } from "../table/columns";
import { TaskStatus } from "../../types";
import { useParams } from "react-router";

export const TaskViewSwitcher = () => {
  const [filters] = useTaskTableFilter();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const params = useParams();
  const projectId = params.projectId as string;

  const workspaceId = useWorkspaceId();

  const { mutate: bulkUpdate } = useBulkUpdateTasks(workspaceId);
  const columns = getColumns(projectId);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "all-tasks",
      workspaceId,
      pageSize,
      pageNumber,
      filters,
      projectId,
    ],
    queryFn: () =>
      getAllTasksApi({
        workspaceId,
        keyword: filters.keyword,
        priority: filters.priority,
        status: filters.status,
        projectId: projectId || filters.projectId,
        assignedTo: filters.assigneeId,
        pageNumber,
        pageSize,
      }),
    staleTime: 0,
    select: (response) => ({
      ...response,
      tasks: response.tasks.map((task: { position: any }) => ({
        ...task,
        position: task.position,
      })),
    }),
  });

  const tasks = data?.tasks || [];
  const totalCount = data?.pagination.totalCount || 0;

  const onKanbanChange = useCallback(
    (
      tasks: {
        id: string;
        status: TaskStatus;
        position: number;
      }[]
    ) => {
       bulkUpdate({
        workspaceId,
        tasks,
      }, {
        onSettled: () => {
          refetch();
        }
      });
    },
    [workspaceId, bulkUpdate, data?.tasks, refetch]
  );
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  // Handle page size changes
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };
  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex  lg:flex-row gap-y-2 items-center justify-start w-full">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
          </TabsList>
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
          </TabsList>
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoading ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable
                isLoading={isLoading}
                data={tasks}
                columns={columns}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pagination={{
                  totalCount,
                  pageNumber,
                  pageSize,
                }}
              />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban onChange={onKanbanChange} data={tasks} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
