import { createLogger, format, transports, Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file"; 
import { config } from "../../config/app.config";

class AppLogger {
  private logger: Logger;

  constructor() {
    const logFormat = format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    );

    // Create logger instance
    this.logger = createLogger({
      level: config.NODE_ENV === "production" ? "info" : "debug",
      format: logFormat,
      transports: [
        new transports.Console(),
        new DailyRotateFile({ 
          dirname: "logs",
          filename: "%DATE%-app.log",
          datePattern: "YYYY-MM-DD",
          maxSize: "20m",
          maxFiles: "14d",
        }),
      ],
    });
  }

  public log(level: string, message: string, meta?: any): void {
    this.logger.log(level, message, meta);
  }

  public error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  public verbose(message: string, meta?: any): void {
    this.logger.verbose(message, meta);
  }

  public getLogger(): Logger {
    return this.logger;
  }
}

// Export a singleton instance
export const logger = new AppLogger();