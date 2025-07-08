import API from "@/config/api-client";
import {
  AllWorkspaceResponseType,
  CreateWorkspaceResponseType,
  CreateWorkspaceType,
  EditWorkspaceType,
  WorkspaceByIdResponseType,
} from "../types";
import { apiRoutes } from "@/constants/app-routes";

const createWorkspaceApi = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post(apiRoutes.workspace.create, data);
  return response.data;
};

const editWorkspaceApi = async ({ workspaceId, data }: EditWorkspaceType) => {
  const response = await API.put(
    `${apiRoutes.workspace.update}/${workspaceId}`,
    data
  );
  return response.data;
};

const getAllWorkspacesUserIsMemberApi =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get(
      apiRoutes.workspace.allWorkspacesUserIsMember
    );
    return response.data;
  };

const getWorkspaceByIdApi = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get(
    `${apiRoutes.workspace.getWorkspaceById}/${workspaceId}`
  );
  return response.data;
};

const deleteWorkspaceApi = async (
  workspaceId: string
): Promise<{
  message: string;
  currentWorkspace: string;
}> => {
  const response = await API.delete(
    `${apiRoutes.workspace.delete}/${workspaceId}`
  );
  return response.data;
};

export {
  createWorkspaceApi,
  editWorkspaceApi,
  deleteWorkspaceApi,
  getAllWorkspacesUserIsMemberApi,
  getWorkspaceByIdApi,
};
