const AUTH_ROUTES = {
  SIGN_IN: "/login",
  SIGN_UP: "/register",
  FORGOT_PASSWORD: `forgot/password`,
  RESET_PASSWORD: "/password/reset",
  VERIFY_EMAIL: "/email/verify/:code",
  GOOGLE_OAUTH_CALLBACK: "/google/oauth/callback",
};

export default AUTH_ROUTES;