import { Router } from "express";
import { taskController } from "./task.module";

const taskRoutes = Router();

taskRoutes.post(
  "/project/:projectId/workspace/:workspaceId/create",
  taskController.createTaskHandler
);

taskRoutes.put(
  "/:id/project/:projectId/workspace/:workspaceId/update",
  taskController.updateTaskHandler
);

taskRoutes.get(
  "/workspace/:workspaceId/all",
  taskController.getAllTasksHandler
);

taskRoutes.get(
  "/:id/project/:projectId/workspace/:workspaceId",
  taskController.getTaskByIdHandler
);

taskRoutes.delete(
  "/:id/workspace/:workspaceId/delete",
  taskController.deleteTaskHandler
);

taskRoutes.post(
  "/workspace/:workspaceId/bulk-update",
  taskController.bulkUpdateTaskStatusHandler
);

export default taskRoutes;
