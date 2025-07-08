import { logger } from "../../common/utils/logger";
import { NotFoundException } from "../../common/utils/catch-errors";
import SessionModel from "../../database/models/session.model";

export class SessionService {
  public async getAllSession(userId: string) {
    logger.info(`Fetching all active sessions for user ${userId}`);

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

    logger.info(
      `Retrieved ${sessions.length} active sessions for user ${userId}`
    );
    return { sessions };
  }
  public async getSessionById(sessionId: string) {
    logger.info(`Fetching session by ID: ${sessionId}`);
    
    const session = await SessionModel.findById(sessionId)
      .populate("userId")
      .select("-expiresAt");

    if (!session) {
      logger.warn(`Session not found with ID: ${sessionId}`);
      throw new NotFoundException("Session not found");
    }

    logger.debug(`Session found for user: ${session.userId}`);
    const { userId: user } = session;

    return {
      user,
    };
  }

  public async deleteSession(sessionId: string, userId: string) {
    logger.info(`Attempting to delete session ${sessionId} for user ${userId}`);

    const deletedSession = await SessionModel.findByIdAndDelete({
      _id: sessionId,
      userId: userId,
    });

    if (!deletedSession) {
      logger.warn(
        `Session not found for deletion - ID: ${sessionId}, User: ${userId}`
      );
      throw new NotFoundException("Session not found");
    }

    logger.info(`Successfully deleted session ${sessionId} for user ${userId}`);
    return;
  }
}
