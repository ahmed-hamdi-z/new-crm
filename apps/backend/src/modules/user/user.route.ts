import { Router } from "express";
import { userController } from "./user.module";
import { authenticateJWT } from "../../common/strategies/jwt.strategy";

const userRoutes = Router();

userRoutes.get("/current", authenticateJWT, userController.currentUserHandler);
userRoutes.put("/:userId/update", authenticateJWT, userController.updateUserHandler);
userRoutes.delete("/:userId/delete", authenticateJWT, userController.deleteUserHandler);
userRoutes.post("/:userId/deactivate", authenticateJWT, userController.deactivateUserHandler);
export default userRoutes;
