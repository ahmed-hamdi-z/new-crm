import { WorkspaceController } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";

const workspaceService = new WorkspaceService();
const workspaceController = new WorkspaceController(workspaceService);

export { workspaceService, workspaceController };
