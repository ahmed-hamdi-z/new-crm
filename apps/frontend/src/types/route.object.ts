import { JSX } from "react";

export interface RouteObject {
  key?: string;
  path: string;
  element: JSX.Element;
}