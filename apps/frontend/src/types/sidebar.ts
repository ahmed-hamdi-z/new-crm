import { JSX } from "react";

interface MenuItem {
  key: string;
  label: string;
  path: string;
}

interface MenuSection {
  id: string;
  title: string;
  icon: JSX.Element;
  items: MenuItem[];
}

export type { MenuItem, MenuSection };