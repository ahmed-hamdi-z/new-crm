import { lazy } from "react";
import { RouteObject } from "@/types/route.object";
import TASKS_ROUTES from "./route.path";

const Tasks = lazy(() => import("@/pages/Workspace/Tasks"));

const tasksRoutePaths: RouteObject[] = [
  { path: TASKS_ROUTES.TASKS, element: <Tasks /> },
];

export default tasksRoutePaths;
