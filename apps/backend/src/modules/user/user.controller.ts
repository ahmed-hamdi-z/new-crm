import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { UserService } from "./user.service";
// Assuming you have a custom type for Express Request that includes 'user'
// For example, in a file like 'types/express.d.ts':
// declare global {
//   namespace Express {
//     interface Request {
//       user?: { _id: string; [key: string]: any }; // Define a more specific type if possible
//     }
//   }
// }

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

      return res.status(200).json({
        success: true,
        message: "Current user retrieved successfully.",
        data: user,
      });
    }
  ); 
}