import { Router } from "express";
import { authController } from "./auth.module";
import { config } from "../../config/app.config";
import passport from "passport";
import { authenticateJWT } from "../../common/strategies/jwt.strategy";
import { setAuthenticationCookies } from "../../common/utils/cookie";

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
    session: false, // Keep this false since you're using JWT
  }),
  (req, res, next) => {
    // This middleware attaches the tokens to the redirect URL if needed
    const { accessToken, refreshToken, mfaRequired } = req.user as any;
    
    if (mfaRequired) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?mfaRequired=true`
      );
    }

    // You can either set cookies here or in the callbackHandler
    setAuthenticationCookies({
      res,
      accessToken,
      refreshToken,
    });
    
    next();
  },
  authController.googleCallbackHandler
);

export default authRoutes;
