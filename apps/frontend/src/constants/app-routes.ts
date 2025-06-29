const appRoutes = {
  home: "/",
  dashboard: {
    path: "/dashboard",
  },
  admin: "/admin",
  auth: {
    path: "/auth",
    login: "/login",
    register: "/register",
    verifyEmail: "/email/verify/:code",
    resetPassword: "/password/reset",
    forgotPassword: "/password/forgot",
  },
  user: {
    profile: "/profile",
    profileSettings: "/profile/settings",
  },
  workspace: {
    path: "/workspace",
    create: "/create/workspace",
  },
  privacy: "/privacy",
  terms: "/terms",
};

const apiRoutes = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    verifyEmail: "/api/auth/email/verify/:code",
    resetPassword: "/api/auth/password/reset",
    forgotPassword: "/api/auth/password/forgot",
    sessions: "/sessions",
    refresh: "/api/auth/refresh",
  },
  workspace: {
    create: "/create/workspace",
  },
  user: {
    current: "/api/user/current",
  },
};

export { appRoutes, apiRoutes };
