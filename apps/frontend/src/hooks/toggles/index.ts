import { useQuery } from "@tanstack/react-query";
import { DEFAULT_TOGGLES, TOGGLES_KEY } from "@/constants/toggles";
import useToggleTheme from "./useToggleTheme";
import useToggleMenu from "./useToggleMenu";
import useToggleLayout from "./useToggleLayout";
import useToggleRTL from "./useToggleRTL";
import useToggleAnimation from "./useToggleAnimation";
import useToggleLocale from "./useToggleLocale";
import useSetPageTitle from "./useSetPageTitle";
import useToggleNavbar from "./useToggleNavbar";
import useToggleSidebar from "./useToggleSidebar";
import useToggleSemidark from "./useToggleSemidark";

interface Language {
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

const getStoredToggles = (): TogglesStateProps => {
  const stored = localStorage.getItem(TOGGLES_KEY);
  return stored ? (JSON.parse(stored) as TogglesStateProps) : DEFAULT_TOGGLES;
};

export const useToggles = () => {
  const { data: toggles = DEFAULT_TOGGLES } = useQuery({
    queryKey: [TOGGLES_KEY],
    queryFn: getStoredToggles,
    staleTime: Infinity,
  });

  return {
    toggles,
    toggleTheme: useToggleTheme(),
    toggleMenu: useToggleMenu(),
    toggleLayout: useToggleLayout(),
    toggleRTL: useToggleRTL(),
    toggleAnimation: useToggleAnimation(),
    toggleLocale: useToggleLocale(),
    toggleSidebar: useToggleSidebar(),
    setPageTitle: useSetPageTitle(),
    toggleNavbar: useToggleNavbar(),
    toggleSemidark: useToggleSemidark(),
  };
};
