export type User = {
    userName: string;
    email: string;
    verified: boolean;
    createdAt: string;
    avatar?: string;
    // Add other fields as needed
  };
  
  export type UserAccount = {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  