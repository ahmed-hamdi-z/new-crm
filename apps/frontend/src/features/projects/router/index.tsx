import { lazy } from "react";
import { RouteObject } from "@/types/route.object";
import PROJECT_ROUTES from "./route.path";

const ProjectDetails = lazy(() => import("@/pages/Workspace/ProjectDetails"));

const projectRoutePaths: RouteObject[] = [
  { path: PROJECT_ROUTES.PROJECT_DETAILS, element: <ProjectDetails /> },

];

export default projectRoutePaths;
