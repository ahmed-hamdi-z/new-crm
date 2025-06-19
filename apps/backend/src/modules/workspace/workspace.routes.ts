import { Router } from "express";
import { workspaceController } from "./workspace.module";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", workspaceController.createWorkspaceHandler);

workspaceRoutes.get("/all", workspaceController.getUserWorkspacesHandler);

workspaceRoutes.get("/members/:id", workspaceController.getWorkspaceMembersHandler);

workspaceRoutes.get("/:id", workspaceController.getWorkspaceByIdHandler);

export default workspaceRoutes;
