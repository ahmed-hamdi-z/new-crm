import { Router } from "express";
import { authController } from "./auth.module";
import { config } from "../../config/app.config";
import passport from "passport";
import { authenticateJWT } from "../../common/strategies/jwt.strategy";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;
const authRoutes = Router();

authRoutes.post("/register", authController.registerUserHandler);
authRoutes.post("/login", authController.loginHandler);
authRoutes.post("/logout", authenticateJWT, authController.logoutHandler);
authRoutes.post("/verify/email", authController.verifyEmail);
authRoutes.post("/password/forgot", authController.forgotPassword);
authRoutes.post("/password/reset", authController.resetPassword);
authRoutes.get("/refresh", authController.refreshToken);

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }), 
  authenticateJWT 
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failedUrl,
    session: false,
  }),
  authController.googleCallbackHandler
);

export default authRoutes;
