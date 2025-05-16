import passport, { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as GoogleStrategy,
  StrategyOptionsWithRequest,
} from "passport-google-oauth20";
import { Request } from "express";
import { setupJwtStrategy } from "../common/strategies/jwt.strategy";
import { authService } from "../modules/auth/auth.module"; // Assuming authService is imported like this

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
  session: false, // Typically false when using tokens/cookies for session management
};

const localVerifyCallback = async (
  req: Request,
  email: string,
  password: string,
  done: (err: any, user?: any, info?: any) => void // Using 'any' for info here aligns with original code, but AuthInfo is better if consistent
) => {
  try {
    // Call the auth service to verify user credentials and get tokens/MFA status
    const result = await authService.verifyUserService({
      email,
      password,
      userAgent: req.headers["user-agent"],
    });

    // Destructure the result which includes user, accessToken, refreshToken, and mfaRequired
    const { user, accessToken, refreshToken, mfaRequired } = result;

    // Pass the user and the authentication info (including tokens and MFA status) to the next step (controller callback)
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
  clientID: config.GOOGLE_CLIENT_ID, // Ensure config is correctly loaded
  clientSecret: config.GOOGLE_CLIENT_SECRET, // Ensure config is correctly loaded
  callbackURL: config.GOOGLE_CALLBACK_URL, // Ensure config is correctly loaded and matches Google Cloud Console
  scope: ["profile", "email"], // Request necessary scopes
  passReqToCallback: true, // Allows access to the request object
};

const googleVerifyCallback = async (
  req: Request,
  // These are the tokens provided by Google, not our application's JWTs.
  // We ignore them here as we generate our own tokens based on the user found/created.
  _accessToken: string,
  _refreshToken: string,
  profile: any, // Profile information from Google
  done: (err: any, user?: any, info?: AuthInfo) => void // Use AuthInfo type for clarity
) => {
  console.log(_accessToken, "Google provided accessToken"); // Log Google's tokens if needed for debugging
  console.log(_refreshToken, "Google provided refreshToken"); // Log Google's tokens if needed for debugging

  try {
    // Extract necessary information from the Google profile
    const { email, sub: googleId, picture } = profile._json;
    console.log(profile, "Google profile data"); // Log full profile if needed
    console.log(googleId, "Google ID (sub)"); // Log Google ID

    // Ensure Google ID is present
    if (!googleId) {
      throw new NotFoundException("Google ID (sub) is missing from profile");
    }

    // Call the auth service to login or create the user based on Google profile
    // This service generates our application's session and JWT tokens
    const result = await authService.loginOrCreateAccountService({
      provider: ProviderEnum.GOOGLE, // Use the correct provider enum
      displayName: profile.displayName,
      providerId: googleId,
      picture: picture,
      email: email,
      userAgent: req.headers["user-agent"], // Pass user agent
    });

    // Destructure the result which includes our user, accessToken, refreshToken, and mfaRequired
    const { user, accessToken, refreshToken, mfaRequired } = result;

    // Pass our user and the authentication info (including our tokens and MFA status)
    // to the next step (controller callback)
    done(null, user, {
      accessToken, // Our application's access token
      refreshToken, // Our application's refresh token
      mfaRequired,
      message: mfaRequired ? "MFA required" : "Google login successful",
    });
  } catch (error: any) {
    // Pass any errors to the next step
    console.error("Error in googleVerifyCallback:", error); // Log the error
    done(error, false, {
      message: error?.message || "Google authentication failed",
    }); // Pass false as user indicates authentication failure
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
  console.log("Passport Google strategy configured.");

  // --- Call the function to set up the JWT strategy ---
  // This strategy is likely used for protected routes AFTER login,
  // verifying the access token from cookies.
  setupJwtStrategy(passport);
  console.log("Passport JWT strategy configured.");
};

// Passport serialization/deserialization might not be strictly necessary for pure token/cookie auth
// if you're not storing user info in sessions after login, but keep if needed elsewhere.
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

// --- JWT Authentication Middleware ---
// Import this from the JWT strategy file
export { authenticateJWT } from "../common/strategies/jwt.strategy";
