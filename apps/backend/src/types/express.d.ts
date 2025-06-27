import mongoose from "mongoose";

declare global {
  namespace Express {
    interface User {
      name: string;
      email: string;
      profilePicture: string | null;
      isEmailVerified: boolean;
      isActive: boolean;
      lastLogin: Date | null;
      currentWorkspace?: mongoose.Types.ObjectId | null;
      preferences: {
        enable2FA: boolean;
        emailNotification: boolean;
        pushNotification: boolean;
        theme: "light" | "dark" | "system";
        language: string;
      };
      // Additional passport-added properties
      ip?: string;
      sessionId?: string;
      sessionID?: string;
      expiresIn?: string;
      userAgent?: string;
    }
  }
}