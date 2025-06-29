import { RouteObject } from "@/types/route.object";
import AUTH_ROUTES from "./route.path";
import Login from "../../../pages/Auth/login";
import Register from "../../../pages/Auth/register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";


const authenticationRoutePaths: RouteObject[] = [
  { path: AUTH_ROUTES.SIGN_IN, element: <Login /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <Register /> },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
];

export default authenticationRoutePaths;