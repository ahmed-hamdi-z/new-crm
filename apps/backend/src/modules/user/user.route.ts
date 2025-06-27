import { Router } from "express";
import { userController } from "./user.module";
import { authenticateJWT } from "../../common/strategies/jwt.strategy";

const userRoutes = Router();

userRoutes.get("/current", authenticateJWT, userController.currentUserHandler);

export default userRoutes;
