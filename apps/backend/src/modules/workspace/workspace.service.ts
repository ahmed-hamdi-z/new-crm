import RoleModel from "../../database/models/roles-permission.model";
import UserModel from "../../database/models/user.model";
import { Roles } from "../../common/enums/role.enum";
import WorkspaceModel from "../../database/models/workspace.model";
import MemberModel from "../../database/models/member.model";
import mongoose from "mongoose";
import { NotFoundException } from "../../common/utils/catch-errors";

export class WorkspaceService {
  public async createWorkspace(
    userId: string,
    body: {
      name: string;
      description?: string | undefined;
    }
  ) {
    const { name, description } = body;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });
    if (!ownerRole) {
      throw new NotFoundException("Owner role not found");
    }

    const workspace = await WorkspaceModel.create({
      name,
      description,
      owner: user._id,
    });

    await workspace.save();

    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });

    await member.save();

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save();

    return { workspace };
  }

  public async getUserWorkspaces(userId: string) {
    const memberships = await MemberModel.find({ userId })
      .populate("workspaceId")
      .select("-password")
      .exec();

    const workspaces = memberships.map((member) => member.workspaceId);

    return { workspaces };
  }

  public async getWorkspaceById(workspaceId: string) {
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const members = await MemberModel.find({ workspaceId }).populate("role");
    const workspaceWithMembers = { ...workspace.toObject(), members };

    return { workspace: workspaceWithMembers };
  }

  public async getWorkspaceMembers(workspaceId: string) {
    const members = await MemberModel.find({ workspaceId })
      .populate("userId", "name email profilePicture")
      .populate("role", "name");

    const roles = await RoleModel.find({}, { name: 1, _id: 1 })
      .select("-permission")
      .lean();

    return { members, roles };
  }
}
