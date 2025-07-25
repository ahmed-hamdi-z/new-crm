import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { TaskService } from "./task.service";
import { RoleGuard } from "../../common/utils/roleGuard";
import { memberService } from "../../modules/member/member.module";
import { projectIdSchema } from "../../common/validators/project.validator";
import { workspaceIdSchema } from "../../common/validators/workspace.validator";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "../../common/validators/task.validator";
import { Permissions } from "../../common/enums/role.enum";
import { HTTPSTATUS } from "../../config/http.config";
import { TaskStatusEnum } from "../../common/enums/task.enum";
import { z } from "zod";

export class TaskController {
  private taskService: TaskService;

  constructor(taskService: TaskService) {
    this.taskService = taskService;
  }

  public createTaskHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?._id;

      const body = createTaskSchema.parse(req.body);
      const projectId = projectIdSchema.parse(req.params.projectId);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.CREATE_TASK]);

      const { task } = await this.taskService.createTask(
        workspaceId,
        projectId,
        userId,
        body
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "Task created successfully",
        task,
      });
    }
  );

  public updateTaskHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?._id;

      const body = updateTaskSchema.parse(req.body);

      const taskId = taskIdSchema.parse(req.params.id);
      const projectId = projectIdSchema.parse(req.params.projectId);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.CREATE_TASK]);

      const { updatedTask } = await this.taskService.updateTask(
        workspaceId,
        projectId,
        taskId,
        body
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "Task updated successfully",
        task: updatedTask,
      });
    }
  );

  public getAllTasksHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?._id;

      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

      const filters = {
        projectId: req.query.projectId as string | undefined,
        status: req.query.status
          ? (req.query.status as string)?.split(",")
          : undefined,
        priority: req.query.priority
          ? (req.query.priority as string)?.split(",")
          : undefined,
        assignedTo: req.query.assignedTo
          ? (req.query.assignedTo as string)?.split(",")
          : undefined,
        keyword: req.query.keyword as string | undefined,
        dueDate: req.query.dueDate as string | undefined,
      };

      const pagination = {
        pageSize: parseInt(req.query.pageSize as string) || 10,
        pageNumber: parseInt(req.query.pageNumber as string) || 1,
      };

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.VIEW_ONLY]);

      const result = await this.taskService.getAllTasks(
        workspaceId,
        filters,
        pagination
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "All tasks fetched successfully",
        ...result,
      });
    }
  );

  public updateAllTasksStatusHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?._id;

      const body = {
        status: req.body.status,
      };

      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.EDIT_TASK]);

      const result = await this.taskService.updateAllTasksStatus(
        body.status,
        userId,
        workspaceId
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "All tasks updated successfully",
        ...result,
      });
    }
  );

  public getTaskByIdHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?._id;

      const taskId = taskIdSchema.parse(req.params.id);
      const projectId = projectIdSchema.parse(req.params.projectId);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.VIEW_ONLY]);

      const task = await this.taskService.getTaskById(
        workspaceId,
        projectId,
        taskId
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "Task fetched successfully",
        task,
      });
    }
  );

  public deleteTaskHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?._id;
      const taskId = taskIdSchema.parse(req.params.id);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.DELETE_TASK]);

      await this.taskService.deleteTask(workspaceId, taskId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Task deleted successfully",
      });
    }
  );

  public bulkUpdateTaskStatusHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?._id;
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

      const body = z
        .object({
          tasks: z.array(
            z.object({
              id: z.string(),
              status: z.nativeEnum(TaskStatusEnum),
              position: z.number().int().positive().min(1000).max(1_000_000),
            })
          ),
        })
        .parse(req.body);

      // Verify user permissions
      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.EDIT_TASK]);

      const result = await this.taskService.bulkUpdateTaskStatus(
        workspaceId,
        userId,
        body.tasks
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "Tasks updated successfully",
        ...result,
      });
    }
  );
}
