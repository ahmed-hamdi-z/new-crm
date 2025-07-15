import { lazy } from "react";
import { RouteObject } from "@/types/route.object";
import WORKSPACE_ROUTES from "./route.path";

const WorkspaceDashboard = lazy(
  () => import("@/pages/Workspace/WorkspaceDashboard")
);
const Settings = lazy(() => import("@/pages/Workspace/Settings"));
const Members = lazy(() => import("@/pages/Workspace/Members"));

const workspaceRoutePaths: RouteObject[] = [
  { path: WORKSPACE_ROUTES.PATH, element: <WorkspaceDashboard /> },
  { path: WORKSPACE_ROUTES.MEMBERS, element: <Members /> },
  { path: WORKSPACE_ROUTES.SETTINGS, element: <Settings /> },
];

export default workspaceRoutePaths;
