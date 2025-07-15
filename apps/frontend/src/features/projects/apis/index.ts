import API from "@/config/api-client";
import {
  AllProjectPayloadType,
  AllProjectResponseType,
  CreateProjectPayloadType,
  EditProjectPayloadType,
  ProjectByIdPayloadType,
  ProjectResponseType,
} from "../types";
import { AnalyticsResponseType } from "@/features/workspace/types";

const createProjectApi = async ({
  workspaceId,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(
    `/api/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

const editProjectApi = async ({
  projectId,
  workspaceId,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(
    `/api/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

const getProjectsInWorkspaceApi = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  const response = await API.get(
    `/api/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

const getProjectByIdApi = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const response = await API.get(
    `/api/project/${projectId}/workspace/${workspaceId}`
  );
  return response.data;
};

const getProjectAnalyticsApi = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const response = await API.get(
    `/api/project/${projectId}/workspace/${workspaceId}/analytics`
  );
  return response.data;
};

const deleteProjectApi = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `/api/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

export {
  createProjectApi,
  getProjectsInWorkspaceApi,
  getProjectByIdApi,
  getProjectAnalyticsApi,
  deleteProjectApi,
  editProjectApi,
};