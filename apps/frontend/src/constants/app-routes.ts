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
    logout: "/auth/logout",
    verifyEmail: "/auth/email/verify/:code",
    resetPassword: "/auth/password/reset",
    forgotPassword: "/auth/password/forgot",
    sessions: "/sessions",
    refresh: "/auth/refresh",
  },
  workspace: {
    create: "/create/workspace",
  },
  user: {
    current: "/user",
  },
};

export { appRoutes, apiRoutes };
