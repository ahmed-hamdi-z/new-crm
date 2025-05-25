import mongoose, { ClientSession } from "mongoose";
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

import UserModel from "../../database/models/user.model";
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
import { access } from "fs";

export class AuthService {
  public async register(registerData: RegisterDto) {
    const { name, email, password } = registerData;

    let session: ClientSession | null = null;

    logger.info(`Attempting user registration for email: ${email}`);
    session = await mongoose.startSession();
    session.startTransaction();
    try {
      const existingUser = await UserModel.exists({
        email,
      }).session(session);

      if (existingUser) {
        throw new BadRequestException(
          "User already exists with this email",
          ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
        );
      }
      const newUser = await UserModel.create({
        name,
        email,
        password: await hashValue(password),
      });

      const userId = newUser._id;

      const verification = await VerificationCodeModel.create({
        userId,
        type: VerificationEnum.EMAIL_VERIFICATION,
        expiresAt: fortyFiveMinutesFromNow(),
      });

      // Sending verification email link
      const verificationUrl = `${config.FRONTEND_ORIGIN}/confirm-account?code=${verification.code}`;
      await sendEmail({
        to: newUser.email,
        ...verifyEmailTemplate(verificationUrl),
      });

      const account = new AccountModel({
        userId: userId,
        provider: ProviderEnum.EMAIL,
        providerId: email,
      });
      await account.save({ session });

      const workspace = new WorkspaceModel({
        name: `My Workspace`,
        description: `Workspace created for ${newUser.name}`,
        owner: userId,
      });
      await workspace.save({ session });

      const ownerRole = await RoleModel.findOne({
        name: Roles.OWNER,
      }).session(session);

      if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
      }

      const member = new MemberModel({
        userId: userId,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      newUser.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await newUser.save();

      await session.commitTransaction();
      logger.info(
        `User successfully registered and transaction committed for email: ${email}`
      );
      session.endSession();

      return {
        user: newUser.omitPassword(),
        workspaceId: workspace._id,
      };
    } catch (error: any) {
      if (session && session.inTransaction()) {
        // Check if session exists and transaction was started
        await session.abortTransaction();
        logger.error(
          `Transaction aborted for email: ${email} due to error: ${error.message}`,
          error
        ); // Log the error
      } else {
        logger.error(
          `Error during registration for email: ${email}, no transaction to abort: ${error.message}`,
          error
        ); // Log if transaction wasn't started
      }
      if (session) {
        session.endSession();
      }
      throw error;
    }
  }

  public async loginOrCreateAccountService(loginData: LoginDto) {
    const { email, userAgent, provider, providerId, picture, displayName } =
      loginData;

    let session: ClientSession | null = null;

    logger.info(`Login attempt for email: ${email}`);

    session = await mongoose.startSession();
    session.startTransaction();

    let user = await UserModel.findOne({ email }).session(session);

    // Start: Handle New User Creation (Transactional)
    if (!user) {
      logger.info(
        `User not found, starting new user creation flow for email: ${email}`
      );

      try {
        // Create the new user
        user = new UserModel({
          email: email,
          name: displayName,
          profilePicture: picture || null,
        });
        // Pass the session to save operation
        await user.save({ session });
        logger.info(`Created new user within transaction: ${user._id}`);

        // Create the user's account link
        const account = new AccountModel({
          userId: user._id,
          provider: provider,
          providerId: providerId,
        });
        // Pass the session to save operation
        await account.save({ session });
        logger.info(`Created account for new user: ${account._id}`);

        // Find the default 'OWNER' role within the session
        const ownerRole = await RoleModel.findOne({
          name: Roles.OWNER,
        }).session(session); // Pass the session to the find operation

        if (!ownerRole) {
          // If role not found, abort transaction and throw error
          await session.abortTransaction();
          throw new NotFoundException("Owner role not found");
        }
        logger.info(`Found owner role: ${ownerRole._id}`);

        // Create a new workspace for the new user
        const workspace = new WorkspaceModel({
          name: `My Workspace`, // Or use a more dynamic default name
          description: `Workspace created for ${user.name}`,
          owner: user._id,
        });
        // Pass the session to save operation
        await workspace.save({ session });
        logger.info(`Created default workspace: ${workspace._id}`);

        // Create the member entry linking the user to the workspace with the owner role
        const member = new MemberModel({
          userId: user._id,
          workspaceId: workspace._id,
          role: ownerRole._id,
          joinedAt: new Date(),
        });
        // Pass the session to save operation
        await member.save({ session });
        logger.info(`Created member entry for new user: ${member._id}`);

        // Update the user document with their current workspace
        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        // Pass the session to save operation
        await user.save({ session });
        logger.info(`Updated new user's current workspace`);

        // If all operations succeeded, commit the transaction
        await session.commitTransaction();
        logger.info(`Transaction committed for new user creation.`);
      } catch (error: any) {
        // If any error occurred during the transaction, abort it
        if (session && session.inTransaction()) {
          await session.abortTransaction();
          logger.error(`Transaction aborted due to error: ${error.message}`);
        }
        // Re-throw the error after cleanup
        throw error;
      } finally {
        // End the session regardless of success or failure
        if (session) {
          await session.endSession();
          logger.info(`Session ended for new user creation.`);
        }
      }
    }

    const mfaRequired = user.preferences?.enable2FA === true;

    // Check for 2FA *before* creating session and tokens if required
    if (mfaRequired) {
      logger.info(`2FA required for user ID: ${user._id}`);
      // Do NOT create session or tokens yet, return signal for MFA flow
      return {
        user: user.omitPassword(),
        mfaRequired: true,
      };
    }
    logger.info(`Creating session for user ID: ${user._id}`);
    const loginSession = await SessionModel.create({
      userId: user._id,
      userAgent,
    });

    logger.info(`Created login session: ${loginSession._id}`);

    logger.info(`Signing tokens for user ID: ${user._id}`);

    const accessToken = signJwtToken({
      userId: user._id,
      sessionId: loginSession._id,
    });

    const refreshToken = signJwtToken(
      {
        sessionId: loginSession._id,
      },
      refreshTokenSignOptions
    );

    logger.info(`Login successful for user ID: ${user._id}`);

    return {
      user,
      accessToken,
      refreshToken,
      mfaRequired: false,
    };
  }

  public async verifyUserService({
    email,
    password,
    provider = ProviderEnum.EMAIL,
    userAgent,
  }: {
    email: string;
    password: string;
    provider?: string;
    userAgent?: string;
  }) {
    let session: ClientSession | null = null;

    session = await mongoose.startSession();
    session.startTransaction();

    try {
      const account = await AccountModel.findOne({
        provider,
        providerId: email,
      }).session(session);
      if (!account) {
        await session.abortTransaction(); // Abort before throwing
        throw new NotFoundException("Invalid email");
      }

      const user = await UserModel.findById(account.userId)
        .session(session)
        .select("+password");

      if (!user || !user.password) {
        await session.abortTransaction();
        throw new NotFoundException("User not found or password not set");
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        await session.abortTransaction();
        throw new UnauthorizedException("Invalid password");
      }

      const mfaRequired = user.preferences?.enable2FA === true;

      if (mfaRequired) {
        await session.commitTransaction(); // Commit since finding user and verifying password was successful
        session.endSession();
        logger.info(
          `2FA required for user ID: ${user._id}. Not creating session/tokens yet.`
        );
        // Do NOT create session or tokens yet, return signal for MFA flow
        return {
          user: user.omitPassword(), // Return user without password
          mfaRequired: true,
          accessToken: "", // Return empty tokens
          refreshToken: "",
        };
      }

      // If 2FA is not required, proceed with session and token creation
      logger.info(`Creating session for user ID: ${user._id}`);
      const loginSession = await SessionModel.create({
        // Ensure SessionModel is imported
        userId: user._id,
        userAgent,
        // Add other session relevant details if needed
      });
      logger.info(`Created login session: ${loginSession._id}`);

      logger.info(`Signing tokens for user ID: ${user._id}`);
      // Ensure signJwtToken and refreshTokenSignOptions are imported
      const accessToken = signJwtToken({
        userId: user._id,
        sessionId: loginSession._id,
      });

      const refreshToken = signJwtToken(
        {
          sessionId: loginSession._id,
        },
        refreshTokenSignOptions
      );

      // Commit the transaction after successful session/token creation
      await session.commitTransaction();
      session.endSession();
      logger.info(`Login successful, tokens created for user ID: ${user._id}`);

      return {
        user: user.omitPassword(), // Return user without password
        accessToken,
        refreshToken,
        mfaRequired: false, // Explicitly false
      };
    } catch (error: any) {
      // Always abort transaction on error if it was started
      if (session && session.inTransaction()) {
        await session.abortTransaction();
        logger.error(
          `Transaction aborted during verifyUserService for email: ${email} due to error: ${error.message}`,
          error
        );
      } else {
        logger.error(
          `Error during verifyUserService for email: ${email}, no transaction to abort: ${error.message}`,
          error
        );
      }
      if (session) {
        session.endSession();
      }
      throw error; // Re-throw the error
    }
  }

  public async refreshToken(refreshToken: string) {
    const { payload } = verifyJwtToken<RefreshTPayload>(refreshToken, {
      secret: refreshTokenSignOptions.secret,
    });

    if (!payload) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const session = await SessionModel.findById(payload.sessionId);
    const now = Date.now();

    if (!session) {
      throw new UnauthorizedException("Session does not exist");
    }

    if (session.expiredAt.getTime() <= now) {
      throw new UnauthorizedException("Session expired");
    }

    const sessionRequireRefresh =
      session.expiredAt.getTime() - now <= ONE_DAY_IN_MS;

    if (sessionRequireRefresh) {
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

    return {
      accessToken,
      newRefreshToken,
    };
  }

  public async verifyEmail(code: string) {
    const validCode = await VerificationCodeModel.findOne({
      code: code,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: { $gt: new Date() },
    });

    if (!validCode) {
      throw new BadRequestException("Invalid or expired verification code");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      validCode.userId,
      {
        isEmailVerified: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new BadRequestException(
        "Unable to verify email address",
        ErrorCode.VALIDATION_ERROR
      );
    }

    await validCode.deleteOne();
    return {
      user: updatedUser,
    };
  }

  public async forgotPassword(email: string) {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    //check mail rate limit is 2 emails per 3 or 10 min
    const timeAgo = threeMinutesAgo();
    const maxAttempts = 2;

    const count = await VerificationCodeModel.countDocuments({
      userId: user._id,
      type: VerificationEnum.PASSWORD_RESET,
      createdAt: { $gt: timeAgo },
    });

    if (count >= maxAttempts) {
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

    const resetLink = `${config.FRONTEND_ORIGIN}/reset-password?code=${
      validCode.code
    }&exp=${expiresAt.getTime()}`;

    const { data, error } = await sendEmail({
      to: user.email,
      ...passwordResetTemplate(resetLink),
    });

    if (!data?.id) {
      throw new InternalServerException(`${error?.name} ${error?.message}`);
    }

    return {
      url: resetLink,
      emailId: data.id,
    };
  }

  public async resePassword({ password, verificationCode }: resetPasswordDto) {
    const validCode = await VerificationCodeModel.findOne({
      code: verificationCode,
      type: VerificationEnum.PASSWORD_RESET,
      expiresAt: { $gt: new Date() },
    });

    if (!validCode) {
      throw new NotFoundException("Invalid or expired verification code");
    }

    const hashedPassword = await hashValue(password);

    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new BadRequestException("Failed to reset password!");
    }

    await validCode.deleteOne();

    await SessionModel.deleteMany({
      userId: updatedUser._id,
    });

    return {
      user: updatedUser,
    };
  }

  public async logout(sessionId: string) {
    return await SessionModel.findByIdAndDelete(sessionId);
  }
}
