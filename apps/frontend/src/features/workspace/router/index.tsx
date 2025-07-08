import { RouteObject } from "@/types/route.object";
import WORKSPACE_ROUTES from "./route.path";

import WorkspaceDashboard from "@/pages/Workspace/WorkspaceDashboard";
import SettingsWithPermission from "@/pages/Workspace/Settings";

const workspaceRoutePaths: RouteObject[] = [
 { path: WORKSPACE_ROUTES.PATH, element: <WorkspaceDashboard /> },
 { path: WORKSPACE_ROUTES.SETTINGS, element: <SettingsWithPermission /> },

];

export default workspaceRoutePaths;