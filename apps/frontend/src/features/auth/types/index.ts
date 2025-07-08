export type loginType = { email: string; password: string };
export type LoginResponseType = {
  message: string;
  user: {
    _id: string;
    currentWorkspace: string;
  };
};

export type UserType = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  isActive: true;
  lastLogin: null;
  createdAt: Date;
  updatedAt: Date;
  currentWorkspace: {
    _id: string;
    name: string;
    owner: string;
    inviteCode: string;
  };
};

export type UserResponseType = {
  _id: string;
  message: string;
  mfaRequired: boolean;
  data?: {
    _id: string;
    email: string;
    name: string;
    currentWorkspace: string;
    profilePicture: string | null;
    isEmailVerified: boolean;
    isActive: boolean;
    lastLogin: string | null;
    preferences: {
      enable2FA: boolean;
      emailNotification: boolean;
      pushNotification: boolean;
      theme: string;
      language: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
};


export type registerType = {
  name: string;
  email: string;
  password: string;
};

export type forgotPasswordType = { email: string };
export type resetPasswordType = { password: string; verificationCode: string };
export type verifyEmailType = { code: string };
export type verifyMFAType = { code: string; secretKey: string };
export type mfaType = {
  message: string;
  secret: string;
  qrImageUrl: string;
};
export type mfaLoginType = { code: string; email: string };
export enum PasswordStrength {
  WEAK = "weak",
  MEDIUM = "medium",
  STRONG = "strong",
  VERY_STRONG = "very-strong",
}

export type SessionType = {
  _id: string;
  userId: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
};

export type SessionResponseType = {
  message: string;
  sessions: SessionType[];
};


