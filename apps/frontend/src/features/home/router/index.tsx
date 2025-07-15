import { RouteObject } from "@/types/route.object";
import BASE_ROUTE from "./route.path";
import { lazy } from "react";

const InviteUser = lazy(() => import("@/pages/Workspace/InviteUser"));
const Home = lazy(() => import("@/pages/Home"));

 const baseRoutePaths: RouteObject[] = [
  { path: BASE_ROUTE.BASE_URL, element: <Home /> },
  { path: BASE_ROUTE.INVITE_URL, element: <InviteUser /> },

];

export default baseRoutePaths;