import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { UserService } from "./user.service";
import { logger } from "../../common/utils/logger";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public currentUserHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
  //  @ts-ignore
      const userId = req.user?._id;

      const user = await this.userService.findUserById(userId);

      logger.info(`User with ID ${userId} retrieved successfully.`);
      return res.status(200).json( user );
    }
  ); 
}