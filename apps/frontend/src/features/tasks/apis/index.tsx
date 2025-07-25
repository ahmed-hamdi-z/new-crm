import API from "@/config/api-client";
import {
  AllTaskPayloadType,
  CreateTaskPayloadType,
  EditTaskPayloadType,
} from "../types";

const createTaskApi = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskPayloadType) => {
  const response = await API.post(
    `/api/task/project/${projectId}/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

const editTaskApi = async ({
  taskId,
  projectId,
  workspaceId,
  data,
}: EditTaskPayloadType): Promise<{ message: string }> => {
  const response = await API.put(
    `/api/task/${taskId}/project/${projectId}/workspace/${workspaceId}/update/`,
    data
  );
  return response.data;
};

const getAllTasksApi = async ({
  workspaceId,
  keyword,
  projectId,
  assignedTo,
  priority,
  status,
  dueDate,
  pageNumber,
  pageSize,
}: AllTaskPayloadType) => {
  const baseUrl = `/api/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (projectId) queryParams.append("projectId", projectId);
  if (assignedTo) queryParams.append("assignedTo", assignedTo);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (pageNumber) queryParams.append("pageNumber", pageNumber?.toString());
  if (pageSize) queryParams.append("pageSize", pageSize?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};

const deleteTaskApi = async ({
  workspaceId,
  taskId,
}: {
  workspaceId: string;
  taskId: string;
}): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `/api/task/${taskId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

const bulkUpdateTaskStatusApi = async ({
  workspaceId,
  tasks,
}: {
  workspaceId: string,
    tasks: Array<{
      id: string;
      status: string;
      position: number;
    }>
}) => {
  const response = await API.post(
    `/api/task/workspace/${workspaceId}/bulk-update`,
    { tasks } 
  );
  return response.data;
};

export {
  createTaskApi,
  editTaskApi,
  getAllTasksApi,
  deleteTaskApi,
  bulkUpdateTaskStatusApi,
};
