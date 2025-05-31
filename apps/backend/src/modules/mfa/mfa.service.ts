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

declare module "express-serve-static-core" {
  interface Request {
    user?: UserDocument;
  }
}

export class MfaService {
  public async generateMFASetup(req: Request) {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException(
        "User not authorized or user ID missing."
      );
    }

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      throw new NotFoundException("User not found in database.");
    }

    if (user.preferences.enable2FA) {
      return {
        message: "MFA already enabled",
      };
    }

    let secretKey = user.preferences.twoFactorSecret;
    if (!secretKey) {
      const secret = speakeasy.generateSecret({ name: "Click" });
      secretKey = secret.base32;
      user.preferences.twoFactorSecret = secretKey;
      await user.save();
    }

    const url = speakeasy.otpauthURL({
      secret: secretKey,
      label: `${user.name}`,
      issuer: "click.sa.net",
      encoding: "base32",
    });

    const qrImageUrl = await qrcode.toDataURL(url);

    return {
      message: "Scan the QR code or use the setup key.",
      secret: secretKey,
      qrImageUrl,
    };
  }

  public async verifyMFASetup(req: Request, code: string, secretKey: string) {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException(
        "User not authorized or user ID missing."
      );
    }

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      throw new NotFoundException("User not found in database.");
    }

    if (user.preferences.enable2FA) {
      return {
        message: "MFA is already enabled",
        userPreferences: {
          enable2FA: user.preferences.enable2FA,
        },
      };
    }

    const isValid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      throw new BadRequestException("Invalid MFA code. Please try again.");
    }

    user.preferences.enable2FA = true;
    await user.save();

    return {
      message: "MFA setup completed successfully",
      userPreferences: {
        enable2FA: user.preferences.enable2FA,
      },
    };
  }

  public async revokeMFA(req: Request) {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException(
        "User not authorized or user ID missing."
      );
    }

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      throw new NotFoundException("User not found in database.");
    }
    if (!user.preferences.enable2FA) {
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
    const user = await UserModel.findOne({ email });

    console.log(user);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!user.preferences.enable2FA && !user.preferences.twoFactorSecret) {
      throw new UnauthorizedException("MFA not enabled for this user");
    }

    const isValid = speakeasy.totp.verify({
      secret: user.preferences.twoFactorSecret,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      throw new BadRequestException("Invalid MFA code. Please try again.");
    }

    const session = await SessionModel.create({
      userId: user._id,
      userAgent,
    });

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

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
