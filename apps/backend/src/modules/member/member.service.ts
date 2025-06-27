import RoleModel from "../../database/models/roles-permission.model";
import { ErrorCode } from "../../common/enums/error-code.enum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/catch-errors";
import MemberModel from "../../database/models/member.model";
import WorkspaceModel from "../../database/models/workspace.model";
import { Roles } from "../../common/enums/role.enum";
import { logger } from "../../common/utils/logger";

export class MemberService {
  public async getMemberRoleInWorkspace(userId: string, workspaceId: string) {
    logger.info(
      `Getting member role for user ${userId} in workspace ${workspaceId}`
    );

    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      logger.warn(`Workspace not found with ID: ${workspaceId}`);
      throw new NotFoundException("Workspace not found");
    }
    logger.debug(`Workspace found: ${workspace.name}`);

    const member = await MemberModel.findOne({ userId, workspaceId }).populate(
      "role"
    );
    if (!member) {
      logger.warn(`User ${userId} is not a member of workspace ${workspaceId}`);
      throw new UnauthorizedException(
        "you are not a member of this workspace",
        ErrorCode.ACCESS_UNAUTHORIZED
      );
    }

    const roleName = member.role?.name;
    logger.info(
      `Retrieved role ${roleName} for user ${userId} in workspace ${workspaceId}`
    );
    return { role: roleName };
  }

  public async joinWorkspaceByInvite(userId: string, inviteCode: string) {
    logger.info(
      `User ${userId} attempting to join workspace with invite code ${inviteCode}`
    );

    const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
    if (!workspace) {
      logger.warn(`Invalid invite code or workspace not found: ${inviteCode}`);
      throw new NotFoundException("Invalid invite code or workspace not found");
    }
    logger.debug(`Workspace found: ${workspace.name} (${workspace._id})`);

    // Check if user is already a member
    const existingMember = await MemberModel.findOne({
      userId,
      workspaceId: workspace._id,
    }).exec();
    if (existingMember) {
      logger.warn(
        `User ${userId} already a member of workspace ${workspace._id}`
      );
      throw new BadRequestException(
        "You are already a member of this workspace"
      );
    }

    const role = await RoleModel.findOne({ name: Roles.MEMBER });
    if (!role) {
      logger.error(`Member role not found in database`);
      throw new NotFoundException("Role not found");
    }
    logger.debug(`Member role found: ${role.name}`);

    // Add user to workspace as a member
    const newMember = new MemberModel({
      userId,
      workspaceId: workspace._id,
      role: role._id,
    });
    await newMember.save();
    logger.info(
      `User ${userId} successfully joined workspace ${workspace._id} as ${role.name}`
    );

    return {
      workspaceId: workspace._id,
      role: role.name,
    };
  }
}
