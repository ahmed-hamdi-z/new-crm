import { Router } from "express";
import { workspaceController } from "./workspace.module";

const workspaceRoutes = Router();

workspaceRoutes.post("/create", workspaceController.createWorkspaceHandler);

export default workspaceRoutes;
