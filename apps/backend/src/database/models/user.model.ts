import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../../common/utils/bcrypt";

// Interface for User Preferences
interface UserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  pushNotification: boolean;
  theme: "light" | "dark" | "system";
  language: string;
  twoFactorSecret: string;
}

// Interface for User Profile
interface UserProfile {
  bio?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    linkedIn?: string;
    github?: string;
  };
}

// Main User Document Interface
export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  profilePicture: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  currentWorkspace: mongoose.Types.ObjectId | null;
  preferences: UserPreferences;
  profile: UserProfile;
  comparePassword(value: string): Promise<boolean>;
  toJSON(): Omit<UserDocument, "password" | "preferences.twoFactorSecret">;
  omitPassword(): Omit<UserDocument, "password">;
}

// User Preferences Schema
const userPreferencesSchema = new Schema<UserPreferences>(
  {
    enable2FA: { type: Boolean, default: false },
    emailNotification: { type: Boolean, default: true },
    pushNotification: { type: Boolean, default: true },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    language: { type: String, default: "en" },
    twoFactorSecret: { type: String, required: false, select: true },
  },
  { _id: false }
);

// User Profile Schema
const userProfileSchema = new Schema<UserProfile>(
  {
    bio: { type: String, required: false },
    website: { type: String, required: false },
    socialMedia: {
      twitter: { type: String, required: false },
      linkedIn: { type: String, required: false },
      github: { type: String, required: false },
    },
  },
  { _id: false }
);

// Main User Schema
const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      select: false,
      minlength: 8,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    currentWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    preferences: {
      type: userPreferencesSchema,
      default: () => ({}),
    },
    profile: {
      type: userProfileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        if (ret.preferences) {
          delete ret.preferences.twoFactorSecret;
        }
        return ret;
      },
      virtuals: true,
    },
  }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

userSchema.methods.omitPassword = function (): Omit<UserDocument, "password"> {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Virtual for full name (if needed)
userSchema.virtual("fullName").get(function () {
  return this.name;
});

// Indexes for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ isActive: 1 });
userSchema.index({ "profile.socialMedia.github": 1 });

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
