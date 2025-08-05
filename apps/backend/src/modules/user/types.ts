export interface UpdateUserInput {
  name?: string;
  profilePicture?: string | null;
  preferences?: {
    enable2FA?: boolean;
    emailNotification?: boolean;
    pushNotification?: boolean;
    theme?: "light" | "dark" | "system";
    language?: string;
  };
  profile?: {
    bio?: string;
    website?: string;
    socialMedia?: {
      twitter?: string;
      linkedIn?: string;
      github?: string;
    };
  };
}