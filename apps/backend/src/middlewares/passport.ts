import passport from "passport";
import { configurePassport } from "../config/passport.config";

const intializePassport = () => {
 configurePassport(passport);
};

intializePassport();
export default passport;
