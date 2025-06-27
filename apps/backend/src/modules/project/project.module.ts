import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

const projectService = new ProjectService();
const projectController = new ProjectController(projectService);

export { projectService, projectController };
 