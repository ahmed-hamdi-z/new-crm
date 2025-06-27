import mongoose from "mongoose";
import { ErrorCode } from "../../common/enums/error-code.enum";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import {
  LoginDto,
  RegisterDto,
  resetPasswordDto,
} from "../../common/interface/auth.interface";
import {
  BadRequestException,
  HttpException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/catch-errors";
import {
  anHourFromNow,
  calculateExpirationDate,
  fortyFiveMinutesFromNow,
  ONE_DAY_IN_MS,
  threeMinutesAgo,
} from "../../common/utils/date-time";
import SessionModel from "../../database/models/session.model";

import UserModel, { UserDocument } from "../../database/models/user.model";
import VerificationCodeModel from "../../database/models/verification.model";
import { config } from "../../config/app.config";

import {
  refreshTokenSignOptions,
  RefreshTPayload,
  signJwtToken,
  verifyJwtToken,
} from "../../common/utils/jwt";
import { sendEmail } from "../../mailers/mailer";
import {
  passwordResetTemplate,
  verifyEmailTemplate,
} from "../../mailers/templates/template";

import { HTTPSTATUS } from "../../config/http.config";
import { hashValue } from "../../common/utils/bcrypt";

import { logger } from "../../common/utils/logger";

import AccountModel from "../../database/models/account.model";
import { ProviderEnum } from "../../common/enums/account-provider.enum";
import WorkspaceModel from "../../database/models/workspace.model";
import RoleModel from "../../database/models/roles-permission.model";
import { Roles } from "../../common/enums/role.enum";
import MemberModel from "../../database/models/member.model";
import "express-session";

export class AuthService {
  public async loginOrCreateAccount(loginData: LoginDto): Promise<{
    user: UserDocument;
    accessToken?: string;
    refreshToken?: string;
    mfaRequired?: boolean;
  }> {
    const { providerId, provider, displayName, email, picture, userAgent } =
      loginData;

    logger.info(`Login attempt for email: ${email} with provider: ${provider}`);

    let user = await UserModel.findOne({ email });

    if (!user) {
      logger.info(`No user found with email: ${email}, creating new user`);
      // Create a new user if it doesn't exist
      user = new UserModel({
        email: email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save();
      logger.info(`New user created with ID: ${user._id}`);

      const account = new AccountModel({
        userId: user._id,
        provider: provider,
        providerId: providerId,
      });
      await account.save();
      logger.info(`Account created for user ID: ${user._id}`);

      // Create a new workspace for the new user
      const workspace = new WorkspaceModel({
        name: `My Workspace`,
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save();
      logger.info(`Workspace created for user ID: ${user._id}`);

      const ownerRole = await RoleModel.findOne({
        name: Roles.OWNER,
      });

      if (!ownerRole) {
        logger.error("Owner role not found in database");
        throw new NotFoundException("Owner role not found");
      }

      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save();
      logger.info(`Member record created for user ID: ${user._id}`);

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save();
      logger.info(`Current workspace set for user ID: ${user._id}`);
    } else {
      logger.info(`Existing user found with ID: ${user._id}`);
    }

    // Handle 2FA case
    if (user.preferences?.enable2FA) {
      logger.info(`2FA required for user ID: ${user._id}`);
      return {
        user,
        accessToken: "",
        refreshToken: "",
        mfaRequired: true,
      };
    }

    if (user) {
      // Create session and tokens for non-2FA case
      logger.info(`Creating session for user ID: ${user._id}`);
      const session = await SessionModel.create({
        userId: user._id,
        userAgent,
      });
      logger.info(`Session created with ID: ${session._id}`);

      logger.info(`Signing tokens for user ID: ${user._id}`);
      const accessToken = signJwtToken({
        userId: user._id,
        sessionId: session._id,
      });

      const refreshToken = signJwtToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions
      );

      logger.info(`Tokens generated successfully for user ID: ${user._id}`);
      return {
        user,
        accessToken,
        refreshToken,
        mfaRequired: false,
      };
    }

    logger.warn(`Unexpected state reached in loginOrCreateAccount`);
    return {
      user,
      mfaRequired: false,
    };
  }

  public async registerUser(registerData: RegisterDto) {
    const { name, email, password } = registerData;
    logger.info(`Registration attempt for email: ${email}`);

    const existingUser = await UserModel.exists({
      email,
    });

    if (existingUser) {
      logger.warn(`User already exists with email: ${email}`);
      throw new BadRequestException(
        "User already exists with this email",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      );
    }

    logger.info(`Creating new user with email: ${email}`);
    const user = new UserModel({
      email,
      name,
      password,
    });

    await user.save();
    logger.info(`User created with ID: ${user._id}`);

    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save();
    logger.info(`Account created for user ID: ${user._id}`);

    const workspace = new WorkspaceModel({
      name: `My Workspace`,
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save();
    logger.info(`Workspace created for user ID: ${user._id}`);

    const ownerRole = await RoleModel.findOne({
      name: Roles.OWNER,
    });
    if (!ownerRole) {
      logger.error("Owner role not found in database");
      throw new NotFoundException("Owner role not found");
    }

    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save();
    logger.info(`Member record created for user ID: ${user._id}`);

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save();
    logger.info(`Current workspace set for user ID: ${user._id}`);

    const verification = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: fortyFiveMinutesFromNow(),
    });
    logger.info(`Verification code created for user ID: ${user._id}`);

    // Sending verification email link
    const verificationUrl = `${config.FRONTEND_ORIGIN}/confirm-account?code=${verification.code}`;
    logger.info(`Sending verification email to: ${user.email}`);
    await sendEmail({
      to: user.email,
      ...verifyEmailTemplate(verificationUrl),
    });
    logger.info(`Verification email sent to: ${user.email}`);

    return {
      user: user,
      userId: user._id,
      workspaceId: workspace._id,
    };
  }

  public async verifyUserService({
    email,
    password,
    provider = ProviderEnum.EMAIL,
  }: {
    email: string;
    password: string;
    provider?: string;
  }) {
    logger.info(
      `Verification attempt for email: ${email} with provider: ${provider}`
    );
    const account = await AccountModel.findOne({ provider, providerId: email });
    if (!account) {
      logger.warn(`No account found for email: ${email}`);
      throw new NotFoundException("Invalid email or password");
    }

    const user = await UserModel.findById(account.userId);

    if (!user) {
      logger.warn(`No user found for account ID: ${account._id}`);
      throw new NotFoundException("User not found for the given account");
    }

    logger.info(`Found user with ID: ${user._id} for verification`);
    const hashedPassword = await hashValue(password);

    if (!hashedPassword) {
      logger.error(`Password hashing failed for user ID: ${user._id}`);
      throw new UnauthorizedException("Invalid email or password");
    }

    logger.info(`User verification successful for ID: ${user._id}`);
    return user;
  }

  public async refreshToken(refreshToken: string) {
    logger.info(`Refresh token attempt`);
    const { payload } = verifyJwtToken<RefreshTPayload>(refreshToken, {
      secret: refreshTokenSignOptions.secret,
    });

    if (!payload) {
      logger.warn(`Invalid refresh token provided`);
      throw new UnauthorizedException("Invalid refresh token");
    }

    const session = await SessionModel.findById(payload.sessionId);
    const now = Date.now();

    if (!session) {
      logger.warn(`Session not found for ID: ${payload.sessionId}`);
      throw new UnauthorizedException("Session does not exist");
    }

    if (session.expiredAt.getTime() <= now) {
      logger.warn(`Session expired for ID: ${session._id}`);
      throw new UnauthorizedException("Session expired");
    }

    const sessionRequireRefresh =
      session.expiredAt.getTime() - now <= ONE_DAY_IN_MS;

    if (sessionRequireRefresh) {
      logger.info(`Refreshing session ID: ${session._id}`);
      session.expiredAt = calculateExpirationDate(
        config.JWT.REFRESH_EXPIRES_IN
      );
      await session.save();
    }

    const newRefreshToken = sessionRequireRefresh
      ? signJwtToken(
          {
            sessionId: session._id,
          },
          refreshTokenSignOptions
        )
      : undefined;

    const accessToken = signJwtToken({
      userId: session.userId,
      sessionId: session._id,
    });

    logger.info(`Tokens refreshed successfully for session ID: ${session._id}`);
    return {
      accessToken,
      newRefreshToken,
    };
  }

  public async verifyEmail(code: string) {
    logger.info(`Email verification attempt with code: ${code}`);
    const validCode = await VerificationCodeModel.findOne({
      code: code,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: { $gt: new Date() },
    });

    if (!validCode) {
      logger.warn(`Invalid or expired verification code: ${code}`);
      throw new BadRequestException("Invalid or expired verification code");
    }

    logger.info(
      `Valid verification code found for user ID: ${validCode.userId}`
    );
    const updatedUser = await UserModel.findByIdAndUpdate(
      validCode.userId,
      {
        isEmailVerified: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      logger.error(`Failed to update user with ID: ${validCode.userId}`);
      throw new BadRequestException(
        "Unable to verify email address",
        ErrorCode.VALIDATION_ERROR
      );
    }

    await validCode.deleteOne();
    logger.info(`Email verified successfully for user ID: ${updatedUser._id}`);
    return {
      user: updatedUser,
    };
  }

  public async forgotPassword(email: string) {
    logger.info(`Password reset request for email: ${email}`);
    const user = await UserModel.findOne({ email });

    if (!user) {
      logger.warn(`No user found with email: ${email}`);
      throw new NotFoundException("User not found");
    }

    const timeAgo = threeMinutesAgo();
    const maxAttempts = 2;

    const count = await VerificationCodeModel.countDocuments({
      userId: user._id,
      type: VerificationEnum.PASSWORD_RESET,
      createdAt: { $gt: timeAgo },
    });

    if (count >= maxAttempts) {
      logger.warn(`Too many password reset attempts for user ID: ${user._id}`);
      throw new HttpException(
        "Too many request, try again later",
        HTTPSTATUS.TOO_MANY_REQUESTS,
        ErrorCode.AUTH_TOO_MANY_ATTEMPTS
      );
    }

    const expiresAt = anHourFromNow();
    const validCode = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationEnum.PASSWORD_RESET,
      expiresAt,
    });
    logger.info(`Password reset code created for user ID: ${user._id}`);

    const resetLink = `${config.FRONTEND_ORIGIN}/reset-password?code=${
      validCode.code
    }&exp=${expiresAt.getTime()}`;

    logger.info(`Sending password reset email to: ${user.email}`);
    const { data, error } = await sendEmail({
      to: user.email,
      ...passwordResetTemplate(resetLink),
    });

    if (!data?.id) {
      logger.error(
        `Failed to send password reset email: ${error?.name} ${error?.message}`
      );
      throw new InternalServerException(`${error?.name} ${error?.message}`);
    }

    logger.info(`Password reset email sent successfully to: ${user.email}`);
    return {
      url: resetLink,
      emailId: data.id,
    };
  }

  public async resePassword({ password, verificationCode }: resetPasswordDto) {
    logger.info(`Password reset attempt with code: ${verificationCode}`);
    const validCode = await VerificationCodeModel.findOne({
      code: verificationCode,
      type: VerificationEnum.PASSWORD_RESET,
      expiresAt: { $gt: new Date() },
    });

    if (!validCode) {
      logger.warn(
        `Invalid or expired password reset code: ${verificationCode}`
      );
      throw new NotFoundException("Invalid or expired verification code");
    }

    logger.info(
      `Valid password reset code found for user ID: ${validCode.userId}`
    );
    const hashedPassword = await hashValue(password);

    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
      password: hashedPassword,
    });

    if (!updatedUser) {
      logger.error(
        `Failed to update password for user ID: ${validCode.userId}`
      );
      throw new BadRequestException("Failed to reset password!");
    }

    await validCode.deleteOne();
    logger.info(`Password reset successfully for user ID: ${validCode.userId}`);

    await SessionModel.deleteMany({
      userId: updatedUser._id,
    });
    logger.info(`Sessions cleared for user ID: ${updatedUser._id}`);

    return {
      user: updatedUser,
    };
  }

  public async logout(sessionId: string) {
    return await SessionModel.findByIdAndDelete(sessionId);
  }
}
