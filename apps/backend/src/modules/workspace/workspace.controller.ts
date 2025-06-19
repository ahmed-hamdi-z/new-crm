import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { WorkspaceService } from "./workspace.service";
import {
  createWorkspaceSchema,
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
}
