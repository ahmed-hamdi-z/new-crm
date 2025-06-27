import { Router } from "express";
import { projectController } from "./project.module";

const projectRoutes = Router();

projectRoutes.post(
  "/workspace/:workspaceId/create",
  projectController.createProjectHandler
);

projectRoutes.put(
  "/:id/workspace/:workspaceId/update",
  projectController.updateProjectHandler
);

projectRoutes.get(
  "/workspace/:workspaceId/all",
  projectController.getAllProjectsInWorkspaceHandler
);

projectRoutes.get(
  "/:id/workspace/:workspaceId",
  projectController.getProjectAndWorkspaceByIdHandler
);

projectRoutes.get(
  "/:id/workspace/:workspaceId/analytics",
  projectController.getProjectAnalyticsHandler
);

projectRoutes.delete(
  "/:id/workspace/:workspaceId/delete",
  projectController.deleteProjectHandler
);
export default projectRoutes;
