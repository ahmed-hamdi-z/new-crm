import { Router } from "express";
import { memberController } from "./member.module";

const memberRoutes = Router();

memberRoutes.post("/workspace/:inviteCode/join", memberController.joinWorkspaceByInviteHandler);

export default memberRoutes;
