import passport, { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as GoogleStrategy,
  Profile,
  StrategyOptionsWithRequest,
} from "passport-google-oauth20";
import { Request } from "express";
import { setupJwtStrategy } from "../common/strategies/jwt.strategy";
import { authService } from "../modules/auth/auth.module";

import { IStrategyOptionsWithRequest } from "passport-local";
import { config } from "./app.config"; // Ensure config is imported
import { NotFoundException } from "../common/utils/catch-errors"; // Ensure NotFoundException is imported
import { ProviderEnum } from "../common/enums/account-provider.enum"; // Ensure ProviderEnum is imported

import { AuthInfo } from "../common/interface/auth.interface"; // Ensure AuthInfo is imported

// --- Local Strategy Setup --- 

const localStrategyOptions: IStrategyOptionsWithRequest = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
  session: false, 
};

const localVerifyCallback = async (
  req: Request,
  email: string,
  password: string,
  done: (err: any, user?: any, info?: any) => void
) => {
  try {
    const result = await authService.verifyUserService({
      email,
      password,
      userAgent: req.headers["user-agent"],
    });

    const { user, accessToken, refreshToken, mfaRequired } = result;

    return done(null, user, {
      accessToken,
      refreshToken,
      mfaRequired,
      message: mfaRequired
        ? "MFA required to complete login"
        : "Login successful",
    });
  } catch (error: any) {
    // Pass any errors to the next step
    return done(error, false, { message: error?.message });
  }
};

// --- Google Strategy Setup ---
const googleStrategyOptions: StrategyOptionsWithRequest = {
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_CALLBACK_URL,
  scope: ["profile", "email"],
  passReqToCallback: true,
};

const googleVerifyCallback = async (
  req: Request,
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: (err: any, user?: any, info?: AuthInfo) => void
) => {
  try {
    const { email, sub: googleId, picture } = profile._json;
    // Ensure Google ID is present
    if (!googleId) {
      throw new NotFoundException("Google ID (sub) is missing from profile");
    }

    const result = await authService.loginOrCreateAccountService({
      provider: ProviderEnum.GOOGLE, 
      displayName: profile.displayName,
      providerId: googleId,
      picture: picture,
      email: email ?? "",
      userAgent: req.headers["user-agent"], 
    });

    const { user, accessToken, refreshToken, mfaRequired } = result;

    done(null, user, {
      accessToken, // Our application's access token
      refreshToken, // Our application's refresh token
      mfaRequired,
      message: mfaRequired ? "MFA required" : "Google login successful",
    });
  } catch (error: any) {
    // Pass any errors to the next step
    console.error("Error in googleVerifyCallback:", error); 
    done(error, false, {
      message: error?.message || "Google authentication failed",
    });
  }
};

// --- Main Passport Configuration Function --- 
export const configurePassport = (passport: PassportStatic) => {
  // Register the Local Strategy
  passport.use(
    "local",
    new LocalStrategy(localStrategyOptions, localVerifyCallback)
  );
  console.log("Passport Local strategy configured.");

  // Register the Google Strategy
  passport.use(
    "google",
    new GoogleStrategy(googleStrategyOptions, googleVerifyCallback)
  );

  setupJwtStrategy(passport);
  console.log("Passport JWT strategy configured.");
};

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

export { authenticateJWT } from "../common/strategies/jwt.strategy";
