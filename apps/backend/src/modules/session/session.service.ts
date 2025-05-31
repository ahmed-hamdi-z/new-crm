import { logger } from "../../common/utils/logger";
import { NotFoundException } from "../../common/utils/catch-errors";
import SessionModel from "../../database/models/session.model";

export class SessionService {
  public async getAllSession(userId: string) {
    const sessions = await SessionModel.find(
      {
        userId,
        expiredAt: { $gt: Date.now() },
      },
      {
        _id: 1,
        userId: 1,
        userAgent: 1,
        createdAt: 1,
        expiredAt: 1,
      },
      {
        sort: {
          createdAt: -1,
        },
      }
    );

    logger.info(`all sessions retrived successfully for user ${userId}`);
    return { sessions };
  }

  public async getSessionById(sessionId: string) {
    const session = await SessionModel.findById(sessionId)
      .populate("userId")
      .select("-expiresAt");

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    const { userId: user } = session;
    logger.info(`Session with ID ${sessionId} retrieved successfully for user ${user}`);
    return {
      user,
    };
  }

  public async deleteSession(sessionId: string, userId: string) {
    const deletedSession = await SessionModel.findByIdAndDelete({
      _id: sessionId,
      userId: userId,
    });

    if (!deletedSession) {
      throw new NotFoundException("Session not found");
    }
    
    logger.info(`Session with ID ${sessionId} deleted successfully`);
    return;
  }
}
