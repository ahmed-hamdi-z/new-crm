import { getEnv } from "../common/utils/get-env";

import dotenv from "dotenv";

dotenv.config();

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  
  APP_ORIGIN: getEnv("APP_ORIGIN", "localhost"),

  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI", "MONGO_URI"),

  JWT: {
    SECRET: getEnv("JWT_SECRET"),
    EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m"),
    REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
    REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "30d"),
  },

  SESSION_SECRET: getEnv("SESSION_SECRET"),
  SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN"),

  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),

  MAILER_SENDER: getEnv("MAILER_SENDER"),

  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
});

export const config = appConfig();
