import { PaginationType } from "@/features/workspace/types";

export type ProjectType = {
  _id: string;
  name: string;
  emoji: string;
  description: string;
  workspace: string;
  createdBy: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectPayloadType = {
  workspaceId: string;
  data: {
    emoji: string;
    name: string;
    description: string;
  };
};

export type ProjectResponseType = {
  message: "Project created successfully";
  project: ProjectType;
};

export type EditProjectPayloadType = {
  workspaceId: string;
  projectId: string;
  data: {
    emoji: string;
    name: string;
    description: string;
  };
};

export type AllProjectPayloadType = {
  workspaceId: string;
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  skip?: boolean;
};

export type AllProjectResponseType = {
  message: string;
  projects: ProjectType[];
  pagination: PaginationType;
};

export type ProjectByIdPayloadType = {
  workspaceId: string;
  projectId: string;
};