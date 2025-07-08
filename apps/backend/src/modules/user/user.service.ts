import mongoose from "mongoose";
import { NotFoundException } from "../../common/utils/catch-errors";
import UserModel, { UserDocument } from "../../database/models/user.model";
import { logger } from "../../common/utils/logger";

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

  public async findUserByEmail(email: string): Promise<UserDocument> {
    logger.info(`Attempting to find user by email: ${email}`);
    
    logger.debug(`Querying database for user email: ${email}`); 
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      logger.warn(`User not found with email: ${email}`);
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    logger.info(`Successfully retrieved user with email: ${email}`);
    return user as UserDocument;
  }

  public async findUsers(): Promise<UserDocument[]> {
    logger.info('Fetching all users');
    
    logger.debug('Querying database for all users');
    const users = await UserModel.find().lean();
    
    logger.info(`Successfully retrieved ${users.length} users`);
    return users as UserDocument[];
  }
}