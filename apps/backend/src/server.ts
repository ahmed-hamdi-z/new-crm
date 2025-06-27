import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { config } from "./config/app.config";
import { errorHandler } from "./middlewares/errorHandler";
import { asyncHandler } from "./middlewares/asyncHandler";
import authRoutes from "./modules/auth/auth.routes";
import connectToDatabase from "./database/database";
import { BadRequestException } from "./common/utils/catch-errors";
import { ErrorCode } from "./common/enums/error-code.enum";
import userRoutes from "./modules/user/user.route";
import passport from "./middlewares/passport";
import { authenticateJWT } from "./common/strategies/jwt.strategy";
// import "./config/passport.config";
import sessionRoutes from "./modules/session/session.routes";
import mfaRoutes from "./modules/mfa/mfa.routes";
import workspaceRoutes from "./modules/workspace/workspace.routes";
import memberRoutes from "./modules/member/member.routes";
import projectRoutes from "./modules/project/project.routes";
import taskRoutes from "./modules/task/task.routes";


const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException(
      "This is a bad request",
      ErrorCode.AUTH_INVALID_TOKEN
    );
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);

app.use(`${BASE_PATH}/user`, authenticateJWT, userRoutes);

app.use(`${BASE_PATH}/member`, authenticateJWT, memberRoutes);

app.use(`${BASE_PATH}/workspace`, authenticateJWT, workspaceRoutes);

app.use(`${BASE_PATH}/project`, authenticateJWT, projectRoutes);

app.use(`${BASE_PATH}/task`, authenticateJWT, taskRoutes);

app.use(`${BASE_PATH}/mfa`, mfaRoutes);

app.use(`${BASE_PATH}/session`, authenticateJWT, sessionRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectToDatabase();
});
