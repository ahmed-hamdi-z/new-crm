import passport, { PassportStatic } from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import { config } from "./app.config";
import { NotFoundException } from "../common/utils/catch-errors";
import { ProviderEnum } from "../common/enums/account-provider.enum";

import { authService } from "../modules/auth/auth.module";

export const SetupGoogleStrategy = (passport: PassportStatic) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
        passReqToCallback: true,
      },
      async (req: Request, accessToken, refreshToken, profile, done) => {
        try {
          const { email, sub: googleId, picture } = profile._json;
          if (!googleId) {
            throw new NotFoundException("Google ID (sub) is missing");
          }

          const result = await authService.loginOrCreateAccount({
            provider: ProviderEnum.GOOGLE,
            displayName: profile.displayName,
            providerId: googleId,
            picture: picture,
            email: email,
            userAgent: req.headers["user-agent"] as string, // Add user agent for session
          });

          // Attach the tokens to the user object
          const userWithTokens = {
            ...result.user.toObject(),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            mfaRequired: result.mfaRequired,
          };

          done(null, userWithTokens);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};

export const SetupLocalStrategy = (passport: PassportStatic) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: true,
      },
      async (email, password, done) => {
        try {
          const user = await authService.verifyUserService({ email, password });
          return done(null, user);
        } catch (error: any) {
          return done(error, false, { message: error?.message });
        }
      }
    )
  );
};

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
