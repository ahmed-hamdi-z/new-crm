export interface Session {
    _id: string; // Unique identifier for the session
    userAgent: string; // Raw user agent string
    browser?: string; // Parsed browser name (e.g., Chrome, Firefox)
    os?: string; // Parsed operating system (e.g., Windows 10, macOS)
    ipAddress: string; // IP address associated with the session
    isCurrent: boolean; // Flag indicating if this is the current session
    lastActiveAt: string | Date; // Timestamp of the last activity (ISO string or Date object)
    createdAt: string | Date; // Timestamp of session creation
  }
  
  export type Sessions = Session[]  