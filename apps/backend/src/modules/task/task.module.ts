import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";

const taskService = new TaskService();
const taskController = new TaskController(taskService);

export { taskService, taskController };
