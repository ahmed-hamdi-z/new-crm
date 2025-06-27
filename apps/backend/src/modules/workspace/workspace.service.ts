import mongoose from "mongoose";
import RoleModel from "../../database/models/roles-permission.model";
import UserModel from "../../database/models/user.model";
import { Roles } from "../../common/enums/role.enum";
import WorkspaceModel from "../../database/models/workspace.model";
import MemberModel from "../../database/models/member.model";
import {
  BadRequestException,
  NotFoundException,
} from "../../common/utils/catch-errors";
import TaskModel from "../../database/models/task.moadel";
import { TaskStatusEnum } from "../../common/enums/task.enum";
import ProjectModel from "../../database/models/project.model";
import { logger } from "../../common/utils/logger";

export class WorkspaceService {
  public async createWorkspace(
    userId: string,
    body: {
      name: string;
      description?: string | undefined;
    }
  ) {
    logger.info(`Creating workspace for user ${userId}`);
    const { name, description } = body;

    logger.debug(`Finding user ${userId}`);
    const user = await UserModel.findById(userId);
    if (!user) {
      logger.warn(`User not found: ${userId}`);
      throw new NotFoundException("User not found");
    }

    logger.debug(`Finding owner role`);
    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });
    if (!ownerRole) {
      logger.error('Owner role not found in database');
      throw new NotFoundException("Owner role not found");
    }

    logger.debug(`Creating new workspace: ${name}`);
    const workspace = await WorkspaceModel.create({
      name,
      description,
      owner: user._id,
    });
    await workspace.save();
    logger.info(`Workspace created with ID: ${workspace._id}`);

    logger.debug(`Creating membership for owner`);
    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save();

    logger.debug(`Updating user's current workspace`);
    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save();

    logger.info(`Workspace setup completed for user ${userId}`);
    return { workspace };
  }

  public async getUserWorkspaces(userId: string) {
    logger.info(`Fetching workspaces for user ${userId}`);
    
    const memberships = await MemberModel.find({ userId })
      .populate("workspaceId")
      .select("-password")
      .exec();

    const workspaces = memberships.map((member) => member.workspaceId);
    logger.info(`Found ${workspaces.length} workspaces for user ${userId}`);

    return { workspaces };
  }

  public async getWorkspaceById(workspaceId: string) {
    logger.info(`Fetching workspace ${workspaceId}`);
    
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      logger.warn(`Workspace not found: ${workspaceId}`);
      throw new NotFoundException("Workspace not found");
    }

    logger.debug(`Fetching members for workspace ${workspaceId}`);
    const members = await MemberModel.find({ workspaceId }).populate("role");
    const workspaceWithMembers = { ...workspace.toObject(), members };

    logger.info(`Workspace details retrieved for ${workspaceId}`);
    return { workspace: workspaceWithMembers };
  }

  public async getWorkspaceMembers(workspaceId: string) {
    logger.info(`Fetching members for workspace ${workspaceId}`);
    
    const members = await MemberModel.find({ workspaceId })
      .populate("userId", "name email profilePicture")
      .populate("role", "name");

    logger.debug(`Fetching available roles`);
    const roles = await RoleModel.find({}, { name: 1, _id: 1 })
      .select("-permission")
      .lean();

    logger.info(`Found ${members.length} members in workspace ${workspaceId}`);
    return { members, roles };
  }

  public async getWorkspaceAnalytics(workspaceId: string) {
    logger.info(`Fetching analytics for workspace ${workspaceId}`);
    const currentDate = new Date();

    logger.debug(`Counting total tasks`);
    const totalTasks = await TaskModel.countDocuments({
      workspace: workspaceId,
    });

    logger.debug(`Counting overdue tasks`);
    const overdueTasks = await TaskModel.countDocuments({
      workspace: workspaceId,
      dueDate: { $lt: currentDate },
      status: { $ne: TaskStatusEnum.DONE },
    });

    logger.debug(`Counting completed tasks`);
    const completedTasks = await TaskModel.countDocuments({
      workspace: workspaceId,
      status: TaskStatusEnum.DONE,
    });

    const analytics = {
      totalTasks,
      overdueTasks,
      completedTasks,
    };

    logger.info(`Analytics retrieved for workspace ${workspaceId}`);
    return { analytics };
  }

  public async changeMemberRoleInWorkspace(
    workspaceId: string,
    memberId: string,
    roleId: string
  ) {
    logger.info(`Changing role for member ${memberId} in workspace ${workspaceId}`);
    
    logger.debug(`Verifying workspace ${workspaceId}`);
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      logger.warn(`Workspace not found: ${workspaceId}`);
      throw new NotFoundException("Workspace not found");
    }

    logger.debug(`Verifying role ${roleId}`);
    const role = await RoleModel.findById(roleId);
    if (!role) {
      logger.warn(`Role not found: ${roleId}`);
      throw new NotFoundException("Role not found");
    }

    logger.debug(`Finding member ${memberId}`);
    const member = await MemberModel.findOne({
      userId: memberId,
      workspaceId: workspaceId,
    });
    if (!member) {
      logger.warn(`Member not found: ${memberId}`);
      throw new NotFoundException("Member not found");
    }

    logger.debug(`Updating role to ${role.name}`);
    member.role = role;
    await member.save();

    logger.info(`Role updated successfully for member ${memberId}`);
    return { member };
  }

  public async updateWorkspaceById(
    workspaceId: string,
    name: string,
    description?: string
  ) {
    logger.info(`Updating workspace ${workspaceId}`);
    
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      logger.warn(`Workspace not found: ${workspaceId}`);
      throw new NotFoundException("Workspace not found");
    }

    logger.debug(`Updating workspace details`);
    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    await workspace.save();

    logger.info(`Workspace ${workspaceId} updated successfully`);
    return {
      workspace,
    };
  }

  public async deleteWorkspaceById(workspaceId: string, userId: string) {
    logger.info(`Starting workspace deletion for ${workspaceId} by user ${userId}`);
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      logger.debug(`Finding workspace ${workspaceId}`);
      const workspace = await WorkspaceModel.findById(workspaceId).session(session);
      if (!workspace) {
        logger.warn(`Workspace not found: ${workspaceId}`);
        throw new NotFoundException("Workspace not found");
      }

      logger.debug(`Checking ownership for user ${userId}`);
      if (!workspace.owner.equals(new mongoose.Types.ObjectId(userId))) {
        logger.warn(`User ${userId} not authorized to delete workspace ${workspaceId}`);
        throw new BadRequestException(
          "You are not authorized to delete this workspace"
        );
      }

      logger.debug(`Finding user ${userId}`);
      const user = await UserModel.findById(userId).session(session);
      if (!user) {
        logger.warn(`User not found: ${userId}`);
        throw new NotFoundException("User not found");
      }

      logger.debug(`Deleting related projects and tasks`);
      await ProjectModel.deleteMany({ workspace: workspace._id }).session(session);
      await TaskModel.deleteMany({ workspace: workspace._id }).session(session);

      logger.debug(`Deleting memberships`);
      await MemberModel.deleteMany({
        workspaceId: workspace._id,
      }).session(session);

      logger.debug(`Updating user's current workspace if needed`);
      if (user?.currentWorkspace?.equals(workspaceId)) {
        const memberWorkspace = await MemberModel.findOne({ userId }).session(session);
        user.currentWorkspace = memberWorkspace
          ? memberWorkspace.workspaceId
          : null;
        await user.save({ session });
      }

      logger.debug(`Deleting workspace`);
      await workspace.deleteOne({ session });

      await session.commitTransaction();
      session.endSession();

      logger.info(`Workspace ${workspaceId} deleted successfully`);
      return {
        currentWorkspace: user.currentWorkspace,
      };
    } catch (error) {
      logger.error(`Error deleting workspace: ${error}`);
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}