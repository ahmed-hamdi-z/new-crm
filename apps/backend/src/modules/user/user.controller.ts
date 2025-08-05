import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { UserService } from "./user.service";
import { logger } from "../../common/utils/logger";
import { UpdateUserInput } from "./types";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public currentUserHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //  @ts-ignore
      const userId = req.user?._id;
      //  @ts-ignore
      const user = await this.userService.findUserById(userId);

      logger.info(`User with ID ${userId} retrieved successfully.`);
      return res.status(200).json(user);
    }
  );

  public updateUserHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.userId;
      // @ts-ignore
      const requestingUserId = req.user?._id;
      const updateData = req.body as UpdateUserInput;

      const updatedUser = await this.userService.updateUser(
        userId,
        updateData,
        requestingUserId
      );

      logger.info(`User with ID ${userId} updated successfully.`);
      return res.status(200).json({
        message: "User account updated successfully",
        updatedUser,
      });
    }
  );

  public deleteUserHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.userId;
      // @ts-ignore
      const requestingUserId = req.user?._id;

      const deletedUser = await this.userService.deleteUser(
        userId,
        requestingUserId
      );

      logger.info(`User with ID ${userId} deleted successfully.`);
      return res.status(200).json({
        success: true,
        message: "User account deleted successfully",
      });
    }
  );

  public deactivateUserHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.userId;
      // @ts-ignore
      const requestingUserId = req.user?._id;

      const deactivatedUser = await this.userService.deactivateUser(
        userId,
        requestingUserId
      );

      logger.info(`User with ID ${userId} deactivated successfully.`);
      return res.status(200).json({
        success: true,
        message: "User account deactivated successfully",
        data: deactivatedUser,
      });
    }
  );
}
