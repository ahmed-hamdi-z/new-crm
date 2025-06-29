export interface Language {
  code: string;
  name: string;
}
export interface TogglesStateProps {
  theme?: "light" | "dark" | "system" | string;
  menu?: "horizontal" | "vertical" | "collapsible-vertical";
  layout?: "full" | "boxed-layout";
  rtlClass?: "ltr" | "rtl";
  animation?: string;
  navbar?: "navbar-sticky" | "navbar-floating" | "navbar-static";
  semidark?: boolean;
  locale?: string;
  isDarkMode?: boolean;
  sidebar?: boolean;
  languageList?: Language[];
}