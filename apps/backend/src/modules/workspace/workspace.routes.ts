import { Router } from "express";
import { workspaceController } from "./workspace.module";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", workspaceController.createWorkspaceHandler);

workspaceRoutes.put(
  "/change/member/role/:id",
  workspaceController.changeMemberRoleInWorkspaceHandler
);

workspaceRoutes.put(
  "/update/:id",
  workspaceController.updateWorkspaceByIdHandler
);

workspaceRoutes.get("/all", workspaceController.getUserWorkspacesHandler);

workspaceRoutes.get(
  "/members/:id",
  workspaceController.getWorkspaceMembersHandler
);

workspaceRoutes.get(
  "/analytics/:id",
  workspaceController.getWorkspaceAnalyticsHandler
);

workspaceRoutes.get("/:id", workspaceController.getWorkspaceByIdHandler);

workspaceRoutes.delete(
  "/delete/:id",
  workspaceController.deleteWorkspaceByIdHandler
);

export default workspaceRoutes;
