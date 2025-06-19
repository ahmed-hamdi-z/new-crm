import { Router } from "express";
import { memberController } from "./member.module";

const workspaceRoutes = Router();

// workspaceRoutes.post("/create/new", memberController.getMemberRoleInWorkspace);

export default workspaceRoutes;
