const apiRoutes = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    verifyEmail: "/api/auth/verify/email",
    resetPassword: "/api/auth/password/reset",
    forgotPassword: "/api/auth/password/forgot",
    refresh: "/api/auth/refresh",
    session: "/api/session",
    allSessions: "/api/session/all",
    mfaVerifySetup: "/api/mfa/verify",
    mfaVerifyLogin: "/api/mfa/verify-login",
    mfaSetup: "/api/mfa/setup",
    mafRevoke: "/api/mfa/revoke"
  },
  workspace: {
    create: "/api/workspace/create/new",
    allWorkspacesUserIsMember: "/api/workspace/all",
    getMembers: "/api/workspace/members",
    changeMemberRole: "/api/workspace/change/member/role",
    getWorkspaceById: "/api/workspace",
    update: "/api/workspace/update",
    delete: "/api/workspace/delete",
    getAnalytics: "/api/workspace/analytics",
  },
  user: {
    current: "/api/user/current",
  },
};

export { apiRoutes };
