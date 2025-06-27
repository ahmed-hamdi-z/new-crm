import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { WorkspaceService } from "./workspace.service";
import {
  changeRoleSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceIdSchema,
} from "../../common/validators/workspace.validator";
import { HTTPSTATUS } from "../../config/http.config";
import { memberService } from "../../modules/member/member.module";
import { RoleGuard } from "../../common/utils/roleGuard";
import { Permissions } from "../../common/enums/role.enum";

export class WorkspaceController {
  private workspaceService: WorkspaceService;

  constructor(workspaceService: WorkspaceService) {
    this.workspaceService = workspaceService;
  }

  public createWorkspaceHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const body = createWorkspaceSchema.parse(req.body);
      // @ts-ignore
      const userId = req.user?._id;

      const { workspace } = await this.workspaceService.createWorkspace(
        userId,
        body
      );

      return res.status(HTTPSTATUS.CREATED).json({
        message: "Workspace created successfully",
        workspace: workspace,
      });
    }
  );

  public getUserWorkspacesHandler = asyncHandler(
    async (req: Request, res: Response) => {
      // @ts-ignore
      const userId = req.user?._id;

      const { workspaces } =
        await this.workspaceService.getUserWorkspaces(userId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Retrieved all workspaces successfully",
        workspaces,
      });
    }
  );

  public getWorkspaceByIdHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const workspaceId = workspaceIdSchema.parse(req.params.id);
      // @ts-ignore
      const userId = req.user?._id;

      await memberService.getMemberRoleInWorkspace(userId, workspaceId);

      const { workspace } =
        await this.workspaceService.getWorkspaceById(workspaceId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Retrieved workspace successfully",
        workspace,
      });
    }
  );

  public getWorkspaceMembersHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const workspaceId = workspaceIdSchema.parse(req.params.id);
      // @ts-ignore
      const userId = req.user?._id;

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.VIEW_ONLY]);

      const { members, roles } =
        await this.workspaceService.getWorkspaceMembers(workspaceId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Retrieved workspace members successfully",
        members,
        roles,
      });
    }
  );

  public getWorkspaceAnalyticsHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const workspaceId = workspaceIdSchema.parse(req.params.id);
      // @ts-ignore
      const userId = req.user?._id;

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.VIEW_ONLY]);

      const { analytics } =
        await this.workspaceService.getWorkspaceAnalytics(workspaceId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Retrieved workspace analytics successfully",
        analytics,
      });
    }
  );

  public changeMemberRoleInWorkspaceHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const workspaceId = workspaceIdSchema.parse(req.params.id);
      const { memberId, roleId } = changeRoleSchema.parse(req.body);
      // @ts-ignore
      const userId = req.user?._id;

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.CHANGE_MEMBER_ROLE]);

      const { member } =
        await this.workspaceService.changeMemberRoleInWorkspace(
          workspaceId,
          memberId,
          roleId
        );

      return res.status(HTTPSTATUS.OK).json({
        message: "Member role changed successfully",
        member,
      });
    }
  );

  public updateWorkspaceByIdHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const workspaceId = workspaceIdSchema.parse(req.params.id);
      const { name, description } = updateWorkspaceSchema.parse(req.body);
      // @ts-ignore
      const userId = req.user?._id;

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.EDIT_WORKSPACE]);

      const { workspace } = await this.workspaceService.updateWorkspaceById(
        workspaceId,
        name,
        description
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "Workspace updated successfully",
        workspace,
      });
    }
  );

  public deleteWorkspaceByIdHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const workspaceId = workspaceIdSchema.parse(req.params.id);
      // @ts-ignore
      const userId = req.user?._id;

      const { role } = await memberService.getMemberRoleInWorkspace(
        userId,
        workspaceId
      );
      RoleGuard.check(role, [Permissions.DELETE_WORKSPACE]);

      const { currentWorkspace } =
        await this.workspaceService.deleteWorkspaceById(workspaceId, userId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Workspace deleted successfully",
        currentWorkspace,
      });
    }
  );
}
