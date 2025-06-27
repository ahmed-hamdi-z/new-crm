import { Request } from "express";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import UserModel, { UserDocument } from "../../database/models/user.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/catch-errors";
import SessionModel from "../../database/models/session.model";
import { refreshTokenSignOptions, signJwtToken } from "../../common/utils/jwt";
import { logger } from "../../common/utils/logger";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserDocument;
  }
}

export class MfaService {
  public async generateMFASetup(req: Request) {
    logger.info('Starting MFA setup generation');
    
    if (!req.user || !req.user._id) {
      logger.warn('Unauthorized MFA setup attempt - missing user or user ID');
      throw new UnauthorizedException(
        "User not authorized or user ID missing."
      );
    }

    logger.debug(`Looking up user with ID: ${req.user._id}`);
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      logger.error(`User not found in database for ID: ${req.user._id}`);
      throw new NotFoundException("User not found in database.");
    }

    if (user.preferences.enable2FA) {
      logger.info(`MFA already enabled for user: ${user._id}`);
      return {
        message: "MFA already enabled",
      };
    }

    let secretKey = user.preferences.twoFactorSecret;
    if (!secretKey) {
      logger.debug('Generating new MFA secret');
      const secret = speakeasy.generateSecret({ name: "Click" });
      secretKey = secret.base32;
      user.preferences.twoFactorSecret = secretKey;
      await user.save();
      logger.info(`New MFA secret saved for user: ${user._id}`);
    } else {
      logger.debug(`Using existing MFA secret for user: ${user._id}`);
    }

    logger.debug('Generating OTPAuth URL');
    const url = speakeasy.otpauthURL({
      secret: secretKey,
      label: `${user.name}`,
      issuer: "click.sa.net",
      encoding: "base32",
    });

    logger.debug('Generating QR code');
    const qrImageUrl = await qrcode.toDataURL(url);
    logger.info('MFA setup successfully generated');

    return {
      message: "Scan the QR code or use the setup key.",
      secret: secretKey,
      qrImageUrl,
    };
  }

  public async verifyMFASetup(req: Request, code: string, secretKey: string) {
    logger.info('Starting MFA setup verification');
    
    if (!req.user || !req.user._id) {
      logger.warn('Unauthorized MFA verification attempt - missing user or user ID');
      throw new UnauthorizedException(
        "User not authorized or user ID missing."
      );
    }

    logger.debug(`Looking up user with ID: ${req.user._id}`);
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      logger.error(`User not found in database for ID: ${req.user._id}`);
      throw new NotFoundException("User not found in database.");
    }

    if (user.preferences.enable2FA) {
      logger.info(`MFA already enabled for user: ${user._id}`);
      return {
        message: "MFA is already enabled",
        userPreferences: {
          enable2FA: user.preferences.enable2FA,
        },
      };
    }

    logger.debug('Verifying MFA code');
    const isValid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      logger.warn('Invalid MFA code provided');
      throw new BadRequestException("Invalid MFA code. Please try again.");
    }

    user.preferences.enable2FA = true;
    await user.save();
    logger.info(`MFA successfully enabled for user: ${user._id}`);

    return {
      message: "MFA setup completed successfully",
      userPreferences: {
        enable2FA: user.preferences.enable2FA,
      },
    };
  }

  public async revokeMFA(req: Request) {
    logger.info('Starting MFA revocation');
    
    if (!req.user || !req.user._id) {
      logger.warn('Unauthorized MFA revocation attempt - missing user or user ID');
      throw new UnauthorizedException(
        "User not authorized or user ID missing."
      );
    }

    logger.debug(`Looking up user with ID: ${req.user._id}`);
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      logger.error(`User not found in database for ID: ${req.user._id}`);
      throw new NotFoundException("User not found in database.");
    }
    if (!user.preferences.enable2FA) {
      logger.info(`MFA not enabled for user: ${user._id}`);
      return {
        message: "MFA is not enabled",
        userPreferences: {
          enable2FA: user.preferences.enable2FA,
        },
      };
    }

    user.preferences.twoFactorSecret;
    user.preferences.enable2FA = false;
    await user.save();
    logger.info(`MFA successfully revoked for user: ${user._id}`);

    return {
      message: "MFA revoke successfully",
      userPreferences: {
        enable2FA: user.preferences.enable2FA,
      },
    };
  }

  public async verifyMFAForLogin(
    code: string,
    email: string,
    userAgent?: string
  ) {
    logger.info(`Starting MFA verification for login with email: ${email}`);
    
    logger.debug(`Looking up user with email: ${email}`);
    const user = await UserModel.findOne({ email });

    logger.debug('User found:', user);

    if (!user) {
      logger.error(`User not found for email: ${email}`);
      throw new NotFoundException("User not found");
    }

    if (!user.preferences.enable2FA && !user.preferences.twoFactorSecret) {
      logger.warn(`MFA not enabled for user: ${user._id}`);
      throw new UnauthorizedException("MFA not enabled for this user");
    }

    logger.debug('Verifying MFA code');
    const isValid = speakeasy.totp.verify({
      secret: user.preferences.twoFactorSecret,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      logger.warn('Invalid MFA code provided');
      throw new BadRequestException("Invalid MFA code. Please try again.");
    }

    logger.debug('Creating new session');
    const session = await SessionModel.create({
      userId: user._id,
      userAgent,
    });
    logger.info(`New session created with ID: ${session._id}`);

    logger.debug('Generating access token');
    const accessToken = signJwtToken({
      userId: user._id,
      sessionId: session._id,
    });

    logger.debug('Generating refresh token');
    const refreshToken = signJwtToken(
      {
        sessionId: session._id,
      },
      refreshTokenSignOptions
    );
    logger.info('Tokens generated successfully');

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}