import passport from "passport";
import { setupJwtStrategy } from "../common/strategies/jwt.strategy";
import { SetupGoogleStrategy, SetupLocalStrategy } from "../config/passport.config";

const initializePassport = () => {
  setupJwtStrategy(passport);
  SetupGoogleStrategy(passport);
  SetupLocalStrategy(passport);
};

initializePassport();

export default passport;