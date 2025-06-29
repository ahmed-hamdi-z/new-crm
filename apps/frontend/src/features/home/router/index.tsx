import { RouteObject } from "@/types/route.object";
import BASE_ROUTE from "./route.path";
import Home from "../../../pages/Home";

 const baseRoutePaths: RouteObject[] = [
  { path: BASE_ROUTE.BASE_URL, element: <Home /> },
];

export default baseRoutePaths;