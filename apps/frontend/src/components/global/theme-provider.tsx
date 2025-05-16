import { PropsWithChildren, useEffect } from "react";
import { useToggles } from "@/hooks/toggles";

function ThemeProvider({ children }: PropsWithChildren) {
  const { toggles } = useToggles();

  useEffect(() => {
    document.body.classList.toggle("dark", toggles.isDarkMode); // Apply dark mode
    document.documentElement.setAttribute("dir", toggles.rtlClass ?? "ltr"); // Apply RTL/LTR

    // Apply language change (i18next)
    import("i18next").then((i18next) => {
      i18next.default.changeLanguage(toggles.locale).catch((err) => {
        console.error("Failed to change language:", err);
      });
    });
    if (toggles.sidebar) {
      document.body.classList.add("sidebar");
    } else {
      document.body.classList.remove("sidebar");
    }
    // Apply navbar state
    document.body.classList.remove(
      "navbar-sticky",
      "navbar-floating",
      "navbar-static"
    );
    if (toggles.navbar) {
      document.body.classList.add(toggles.navbar);
    }
    // Apply layout state
    document.body.classList.remove("full", "boxed-layout");
    if (toggles.layout) {
      document.body.classList.add(toggles.layout);
    }
  }, [
    toggles.isDarkMode,
    toggles.rtlClass,
    toggles.locale,
    toggles.sidebar,
    toggles.navbar,
    toggles.layout,
  ]);

  return (
    <div
      className={`${(toggles.sidebar && "toggle-sidebar") || ""} ${
        toggles.menu
      } ${toggles.layout} ${
        toggles.rtlClass
      } main-section antialiased relative font-nunito text-sm font-normal`}
    >
      {children}
    </div>
  );
}

export default ThemeProvider;
