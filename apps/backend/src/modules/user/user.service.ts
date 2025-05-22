import mongoose from "mongoose"; // Removed ClientSession as it's not used for this read operation
import { NotFoundException } from "../../common/utils/catch-errors"; // Changed to NotFoundException for clarity
import UserModel, { UserDocument } from "../../database/models/user.model";

export class UserService {
  /**
   * Finds a user by their ID.
   * @param userId The ID of the user to find.
   * @returns A promise that resolves to the UserDocument.
   * @throws NotFoundException if the user with the given ID is not found.
   */
  public async findUserById(userId: string): Promise<UserDocument> {
    // Validate if userId is a valid MongoDB ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new NotFoundException(`Invalid user ID format: ${userId}`);
    }

    const user = await UserModel.findById(userId)
      .populate("currentWorkspace") 
      .select("-password") 
      .lean(); 
      
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return user as UserDocument;
  }
}
