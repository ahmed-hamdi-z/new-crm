// src/api/workspace-api.ts
import API from "@/config/api-client";
import { apiRoutes } from "@/constants/app-routes";

/**
 * Creates a new workspace 
 * @param {Object} data - Workspace data
 * @returns {Promise<any>} - Created workspace data
 */
export const createWorkspaceApi = async (data: {
  name: string;
  image?: File | string;
}) => {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.image) {
    if (typeof data.image === "string") {
      formData.append("image", data.image);
    } else {
      formData.append("file", data.image);
    }
  }

  return API.post(apiRoutes.workspace.create, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

