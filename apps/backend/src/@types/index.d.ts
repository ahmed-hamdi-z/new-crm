import { UserDocument } from "../database/models/user.model";
import { Request } from "express";

declare module "express-serve-static-core" {
  namespace Express {
    interface User extends UserDocument {}
    interface Request { 
      user?: UserDocument;
      ip?: string;
      _id?: string;
      sessionId?: string;
      sessionID?: string;
      expiresIn?: string;
      currentWorkspace?: string; 
      userAgent?: string;
      preferences?: UserDocument["preferences"];
    }
  }
}