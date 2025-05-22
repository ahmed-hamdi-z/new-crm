import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { AuthService } from "./auth.service";
import { HTTPSTATUS } from "../../config/http.config";

import {
  emailSchema,
  registerSchema,
  resetPasswordSchema,
  verificationEmailSchema,
} from "../../common/validators/auth.validator";

import {
  clearAuthenticationCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthenticationCookies,
} from "../../common/utils/cookie";

import { UnauthorizedException } from "../../common/utils/catch-errors";
import { AuthInfo, LoginDto } from "common/interface/auth.interface";
import passport from "passport";
import { config } from "../../config/app.config";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  //   public googleCallback =  asyncHandler(
  //   async (req: Request, res: Response) => {
  //     const currentWorkspace = req.user?.currentWorkspace;

  //     if (!currentWorkspace) {
  //       return res.redirect(
  //         `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
  //       );
  //     }

  //     return res.redirect(
  //       `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
  //     );
  //   }
  // );

  public googleCallback = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        "google", // The name of the Google strategy
        { session: false }, // Options: disable sessions
        (err: Error | null, user: any, info: AuthInfo | undefined) => {
          // Handle errors passed from the strategy (authService errors)
          if (err) {
            console.error("Google Auth Error:", err);
            // Redirect to a failure page on the frontend
            return res.redirect(
              `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&message=${encodeURIComponent(err.message || "Authentication failed")}`
            );
          }

          // Handle Authentication Failure (User not found or invalid credentials by strategy)
          if (!user) {
            console.warn("Google Auth Failed: User not found/created");
            // Redirect to a failure page on the frontend
            return res.redirect(
              `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&message=${encodeURIComponent(info?.message || "Authentication failed")}`
            );
          }

          const { accessToken, refreshToken, mfaRequired } = info || {};
          if (!accessToken || !refreshToken) {
            console.error("Google Auth Error: Tokens not returned by service");
            return res.redirect(
              `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&message=${encodeURIComponent("Failed to generate tokens")}`
            );
          }

          // Set the authentication cookies
          setAuthenticationCookies({ res, accessToken, refreshToken });
          console.log(`Cookies set for Google user: ${user._id}`);

          // Handle MFA requirement or successful login redirect
          if (mfaRequired) {
            console.log(`MFA required for Google user: ${user._id}`);
            return res.redirect(
              `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=mfa_required&userId=${user._id}` // Example: Pass user ID
            );
          } else {
            // @ts-ignore
            const currentWorkspace = user?.currentWorkspace;

            if (!currentWorkspace) {
              console.error(
                `Google Auth Error: No current workspace for user: ${user._id}`
              );
              // Redirect to a setup/onboarding page or failure
              return res.redirect(
                `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&message=${encodeURIComponent("User has no current workspace")}`
              );
            }
            console.log(
              `Google login successful, redirecting user ${user._id} to workspace ${currentWorkspace}`
            );
            return res.redirect(
              `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
            );
          }
        }
      )(req, res, next); // This line invokes the passport.authenticate middleware
    }
  );

  public register = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = registerSchema.parse({
        ...req.body,
      });
      const { user } = await this.authService.register(body);

      return res.status(HTTPSTATUS.CREATED).json({
        message:
          "User registered successfully. Please check your email to verify your account.",
        data: user,
      });
    }
  );

  public login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Use passport.authenticate with the 'local' strategy and a custom callback.
      passport.authenticate(
        "local",
        { session: false }, // Options: disable sessions
        // Use AuthInfo type for info
        (err: Error | null, user: any, info: AuthInfo | undefined) => {
          // Handle errors passed from the strategy (authService errors)
          if (err) {
            console.error("Local Login Error:", err);
            return next(err);
          }
          // Handle Authentication Failure (User not found or invalid credentials by strategy)
          if (!user) {
            console.warn(
              "Local Login Failed: User not found or invalid credentials"
            );
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({
              message: info?.message || "Authentication failed",
            });
          }

          const { accessToken, refreshToken, mfaRequired } = info || {};

          if (!accessToken || !refreshToken) {
            console.error(
              "Local Login Error: Tokens not returned by verifyUserService"
            );
            return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
              message: "Failed to generate tokens",
            });
          }

          // Check if MFA is required
          if (mfaRequired) {
            console.log(`MFA required for user: ${user._id}`);

            return res.status(HTTPSTATUS.OK).json({
              user:
                user && typeof user.omitPassword === "function"
                  ? user.omitPassword()
                  : user,
              mfaRequired: true,
              message: info?.message || "MFA required to complete login",
            });
          } else {
            console.log(`Local login successful for user: ${user._id}`);
            // Set the authentication cookies
            setAuthenticationCookies({ res, accessToken, refreshToken });

            // Return a success response without the tokens in the body
            return res.status(HTTPSTATUS.OK).json({
              message: info?.message || "Login successful",
              user:
                user && typeof user.omitPassword === "function"
                  ? user.omitPassword()
                  : user,
              mfaRequired: false,
            });
          }
        }
      )(req, res, next); // This line invokes the passport.authenticate middleware
    }
  );

  // Add a logout method
  public logout = asyncHandler(async (req: Request, res: Response) => {
    // Clear the authentication cookies
    clearAuthenticationCookies(res);
    return res.status(HTTPSTATUS.OK).json({
      message: "Logged out successfully",
    });
  });

  public refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const refreshToken = req.cookies.refreshToken as string | undefined;
      if (!refreshToken) {
        throw new UnauthorizedException("Missing refresh token");
      }

      const { accessToken, newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      if (newRefreshToken) {
        res.cookie(
          "refreshToken",
          newRefreshToken,
          getRefreshTokenCookieOptions()
        );
      }

      return res
        .status(HTTPSTATUS.OK)
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .json({
          message: "Refresh access token successfully",
        });
    }
  );

  public verifyEmail = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { code } = verificationEmailSchema.parse(req.body);
      await this.authService.verifyEmail(code);

      return res.status(HTTPSTATUS.OK).json({
        message: "Email verified successfully",
      });
    }
  );

  public forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const email = emailSchema.parse(req.body.email);
      await this.authService.forgotPassword(email);

      return res.status(HTTPSTATUS.OK).json({
        message: "Password reset email sent",
      });
    }
  );

  public resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = resetPasswordSchema.parse(req.body);

      await this.authService.resePassword(body);

      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
        message: "Reset Password successfully",
      });
    }
  );
}
