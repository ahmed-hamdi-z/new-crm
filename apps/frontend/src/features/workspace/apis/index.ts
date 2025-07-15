import API from "@/config/api-client";
import {
  AllMembersInWorkspaceResponseType,
  AllWorkspaceResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
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

const getWorkspaceAnalyticsApi = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`${apiRoutes.workspace.getAnalytics}/${workspaceId}`);
  return response.data;
};

const getMembersInWorkspaceApi = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`${apiRoutes.workspace.getMembers}/${workspaceId}`);
  return response.data;
};

const changeWorkspaceMemberRoleApi = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  const response = await API.put(
    `${apiRoutes.workspace.changeMemberRole}/${workspaceId}`,
    data
  );
  return response.data;
};

 const invitedUserJoinWorkspaceApi = async (
  iniviteCode: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  const response = await API.post(`/api/member/workspace/${iniviteCode}/join`);
  return response.data;
};

export {
  createWorkspaceApi,
  editWorkspaceApi,
  deleteWorkspaceApi,
  getAllWorkspacesUserIsMemberApi,
  getMembersInWorkspaceApi,
  changeWorkspaceMemberRoleApi,
  getWorkspaceAnalyticsApi,
  getWorkspaceByIdApi,
  invitedUserJoinWorkspaceApi
};
