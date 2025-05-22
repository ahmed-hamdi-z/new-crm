export type User = {
   name: string;
   email: string;
   profilePicture: string | null;
   isEmailVerified: boolean;
   isActive: boolean; 
   lastLogin: Date | null;
   createdAt: Date;
   updatedAt: Date;
   currentWorkspace: string | null;
  //  preferences: UserPreferences;
   profile: any;
  };
  
  export type UserAccount = {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  