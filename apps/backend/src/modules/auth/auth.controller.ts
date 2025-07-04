import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { AuthService } from "./auth.service";
import { HTTPSTATUS } from "../../config/http.config";

import {
  emailSchema,
  loginSchema,
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

import {
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/catch-errors";
import passport from "passport";
import { config } from "../../config/app.config";
import { authService } from "./auth.module";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

 public googleCallbackHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // @ts-ignore
    const { accessToken, refreshToken, mfaRequired, currentWorkspace } = req.user;

    if (mfaRequired) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?mfaRequired=true`
      );
    }

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    setAuthenticationCookies({
      res,
      accessToken,
      refreshToken,
    });

    return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    );
  }
);

  public registerUserHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const body = registerSchema.parse({
        ...req.body,
      });
      const { user } = await this.authService.registerUser(body);
      return res.status(HTTPSTATUS.CREATED).json({
        message: "User registered successfully",
        mfaRequired: false,
        data: user,
      });
    }
  );

  public loginHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        "local",
        async (
          err: Error | null,
          user: Express.User | false,
          info: { message: string } | undefined
        ) => {
          if (err) {
            return next(err);
          }

          if (!user) {
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({
              message: info?.message || "Invalid email or password",
            });
          }

          const userAgent = req.headers["user-agent"];
          const body = loginSchema.parse({
            ...req.body,
            userAgent,
          });

          const { accessToken, refreshToken, mfaRequired } =
            await authService.loginOrCreateAccount(body);

          if (mfaRequired) {
            return res.status(HTTPSTATUS.OK).json({
              message: "Verify MFA authentication",
              mfaRequired,
              user,
            });
          }
          req.logIn(user, (err: Error) => {
            if (err) {
              return next(err);
            }

            return setAuthenticationCookies({
              res,
              accessToken,
              refreshToken,
            })
              .status(HTTPSTATUS.OK)
              .json({
                message: "User logged in successfully",
                mfaRequired,
                user,
              });
          });
        }
      )(req, res, next);
    }
  );

  // Add a logout method
  public logout = asyncHandler(async (req: Request, res: Response) => {});

  public refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
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
  });

  public verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { code } = verificationEmailSchema.parse(req.body);
    await this.authService.verifyEmail(code);

    return res.status(HTTPSTATUS.OK).json({
      message: "Email verified successfully",
    });
  });

  public forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const email = emailSchema.parse(req.body.email);
    await this.authService.forgotPassword(email);

    return res.status(HTTPSTATUS.OK).json({
      message: "Password reset email sent",
    });
  });

  public resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const body = resetPasswordSchema.parse(req.body);

    await this.authService.resePassword(body);

    return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
      message: "Reset Password successfully",
    });
  });

  public logoutHandler = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      // @ts-ignore
      const sessionId = req.sessionId;
      if (!sessionId) {
        throw new NotFoundException("Session is invalid.");
      }
      await this.authService.logout(sessionId);
      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
        message: "User logout successfully",
      });
    }
  );
}
