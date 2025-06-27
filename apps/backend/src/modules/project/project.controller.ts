import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { ProjectService } from "./project.service";
import { workspaceIdSchema } from "../../common/validators/workspace.validator";
import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from "../../common/validators/project.validator";
import { Permissions } from "../../common/enums/role.enum";
import { HTTPSTATUS } from "../../config/http.config";
import { memberService } from "../../modules/member/member.module";
import { RoleGuard } from "../../common/utils/roleGuard";
import { projectService } from "./project.module";

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  public createProjectHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const body = createProjectSchema.parse(req.body);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
      // @ts-ignore
      const userId = req.user?._id;
      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.CREATE_PROJECT]);

      const { project } = await projectService.createProject(
        userId,
        workspaceId,
        body
      );

      return res.status(HTTPSTATUS.CREATED).json({
        message: "Project created successfully",
        project,
      });
    }
  );

  public getAllProjectsInWorkspaceHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
      // @ts-ignore
      const userId = req.user?._id;
      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.VIEW_ONLY]);

      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const pageNumber = parseInt(req.query.pageNumber as string) || 1;

      const { projects, totalCount, totalPages, skip } =
        await projectService.getAllProjectsInWorkspace(
          workspaceId,
          pageSize,
          pageNumber
        );

      return res.status(HTTPSTATUS.OK).json({
        message: "Project fetched successfully",
        projects,
        pagination: {
          totalCount,
          pageSize,
          pageNumber,
          totalPages,
          skip,
          limit: pageSize,
        },
      });
    }
  );

  public getProjectAndWorkspaceByIdHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const projectId = projectIdSchema.parse(req.params.id);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
      // @ts-ignore
      const userId = req.user?._id;

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.VIEW_ONLY]);

      const { project } = await projectService.getProjectAndWorkspaceById(
        workspaceId,
        projectId
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "Project fetched successfully",
        project,
      });
    }
  );

  public getProjectAnalyticsHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const projectId = projectIdSchema.parse(req.params.id);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
      // @ts-ignore
      const userId = req.user?._id;

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.VIEW_ONLY]);

      const analytics = await projectService.getProjectAnalytics(
        workspaceId,
        projectId
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "Project analytics fetched successfully",
        analytics,
      });
    }
  );

  public updateProjectHandler = asyncHandler(
    async (req: Request, res: Response) => {
      // @ts-ignore
         const userId = req.user?._id;

    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const body = updateProjectSchema.parse(req.body);

    const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      ); 
      RoleGuard.check(role, [Permissions.EDIT_PROJECT]);

      const { project } = await projectService.updateProject(
      workspaceId,
      projectId,
      body
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Project updated successfully",
      project,
    });
    }
  );

  public deleteProjectHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const projectId = projectIdSchema.parse(req.params.id);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
      // @ts-ignore
      const userId = req.user?._id;
      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.DELETE_PROJECT]);

       await projectService.deleteProject(workspaceId, projectId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Project deleted successfully",
      });
    }
  );
}
