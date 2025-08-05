import mongoose from "mongoose";
import {
  BadRequestException,
  NotFoundException,
} from "../../common/utils/catch-errors";
import UserModel, { UserDocument } from "../../database/models/user.model";
import { logger } from "../../common/utils/logger";
import { UpdateUserInput } from "./types";
import VerificationCodeModel from "../../database/models/verification.model";
import AccountModel from "../../database/models/account.model";
import WorkspaceModel from "../../database/models/workspace.model";
import MemberModel from "../../database/models/member.model";

export class UserService {
  /**
   * Finds a user by their ID.
   * @param userId The ID of the user to find.
   * @returns A promise that resolves to the UserDocument.
   * @throws NotFoundException if the user with the given ID is not found.
   */
  public async findUserById(userId: string): Promise<UserDocument> {
    logger.info(`Attempting to find user by ID: ${userId}`);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      logger.warn(`Invalid user ID format provided: ${userId}`);
      throw new NotFoundException(`Invalid user ID format: ${userId}`);
    }

    logger.debug(`Querying database for user ID: ${userId}`);
    const user = await UserModel.findById(userId)
      .populate("currentWorkspace")
      .select("-password")
      .lean();

    if (!user) {
      logger.warn(`User not found with ID: ${userId}`);
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    logger.info(`Successfully retrieved user with ID: ${userId}`);
    return user as UserDocument;
  }
  public async updateUser(
    userId: string,
    updateData: UpdateUserInput,
    requestingUserId: string
  ): Promise<UserDocument> {
    logger.info(`Attempting to update user with ID: ${userId}`);

    // Validate user IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(requestingUserId)
    ) {
      logger.warn(
        `Invalid user ID format provided: ${userId} or ${requestingUserId}`
      );
      throw new BadRequestException("Invalid user ID format");
    }

    // Prevent updating sensitive fields
    const restrictedFields = [
      "password",
      "isEmailVerified",
      "isActive",
      "createdAt",
      "updatedAt",
    ];
    for (const field of restrictedFields) {
      if (field in updateData) {
        logger.warn(`Attempt to update restricted field: ${field}`);
        throw new BadRequestException(
          `Cannot update ${field} through this endpoint`
        );
      }
    }

    logger.debug(
      `Updating user ${userId} with data: ${JSON.stringify(updateData)}`
    );
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select("-password")
      .lean();

    if (!updatedUser) {
      logger.warn(`User not found with ID: ${userId}`);
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    logger.info(`Successfully updated user with ID: ${userId}`);
    return updatedUser as UserDocument;
  }

  /**
   * Deletes a user account.
   * @param userId The ID of the user to delete.
   * @param requestingUserId The ID of the user making the request (for authorization).
   * @returns A promise that resolves to the deleted UserDocument.
   * @throws NotFoundException if the user is not found.
   * @throws ForbiddenException if the requesting user is not authorized to delete this user.
   */
  public async deleteUser(
    userId: string,
    requestingUserId: string
  ): Promise<{ success: boolean; message: string }> {
    logger.info(`Attempting to delete user with ID: ${userId}`);

    // Validate user IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(requestingUserId)
    ) {
      logger.warn(
        `Invalid user ID format provided: ${userId} or ${requestingUserId}`
      );
      throw new BadRequestException("Invalid user ID format");
    }

    // 1. Find the user first to get related data
    const user = await UserModel.findById(userId);
    if (!user) {
      logger.warn(`User not found with ID: ${userId}`);
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // 2. Delete all verification codes
    await VerificationCodeModel.deleteMany({ userId: user._id });
    logger.info(`Deleted verification codes for user ${userId}`);

    // 3. Delete all accounts
    await AccountModel.deleteMany({ userId: user._id });
    logger.info(`Deleted accounts for user ${userId}`);

    // 4. Find all workspaces where user is owner
    const ownedWorkspaces = await WorkspaceModel.find({ owner: user._id });

    // 5. For each owned workspace:
    for (const workspace of ownedWorkspaces) {
      // Delete all members in this workspace
      await MemberModel.deleteMany({ workspaceId: workspace._id });
      logger.info(`Deleted members for workspace ${workspace._id}`);

      // Delete the workspace
      await WorkspaceModel.findByIdAndDelete(workspace._id);
      logger.info(`Deleted workspace ${workspace._id}`);
    }

    // 6. Delete all memberships where user is member (not owner)
    await MemberModel.deleteMany({ userId: user._id });
    logger.info(`Deleted remaining memberships for user ${userId}`);

    // 7. Finally delete the user
    await UserModel.findByIdAndDelete(user._id);
    logger.info(`Deleted user ${userId}`);

    return {
      success: true,
      message: "User account and all associated data deleted successfully",
    };
  }

  /**
   * Soft delete (deactivate) user account
   * @param userId The ID of the user to deactivate
   * @param requestingUserId The ID of the user making the request
   * @returns Promise with deactivated user document
   */
  public async deactivateUser(
    userId: string,
    requestingUserId: string
  ): Promise<UserDocument> {
    logger.info(`Attempting to deactivate user with ID: ${userId}`);

    // Validate user IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(requestingUserId)
    ) {
      logger.warn(
        `Invalid user ID format provided: ${userId} or ${requestingUserId}`
      );
      throw new BadRequestException("Invalid user ID format");
    }

    // Authorization check
    if (userId !== requestingUserId) {
      logger.warn(
        `User ${requestingUserId} attempted to deactivate another user ${userId}`
      );
      throw new BadRequestException("You can only deactivate your own account");
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        isActive: false,
        lastLogin: null,
        $unset: { currentWorkspace: 1 }, // Remove current workspace reference
      },
      { new: true }
    )
      .select("-password")
      .lean();

    if (!user) {
      logger.warn(`User not found with ID: ${userId}`);
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // Also deactivate all accounts
    await AccountModel.updateMany({ userId }, { isActive: false });

    logger.info(`Successfully deactivated user ${userId}`);
    return user as UserDocument;
  }
}
