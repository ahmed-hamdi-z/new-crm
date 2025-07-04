import { RouteObject } from "@/types/route.object";

import WORKSPACE_ROUTES from "./route.path";
import WorkspaceDashboard from "@/pages/Workspace/WorkspaceDashboard";

const workspaceRoutePaths: RouteObject[] = [
 { path: WORKSPACE_ROUTES.PATH, element: <WorkspaceDashboard /> },
];

export default workspaceRoutePaths;