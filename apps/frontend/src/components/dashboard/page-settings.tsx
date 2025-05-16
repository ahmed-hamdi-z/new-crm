import { useState } from "react";
import ToggleButton from "./toggles-button";
import { useToggles } from "@/hooks/toggles";
import { Label } from "../ui/label";
import { SystemIcon, LightIcon, DarkIcon , SettingsIcon } from "@/assets/icons/app-icons";

const PageSetting: React.FC = () => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const {
    toggles,
    toggleTheme,
    toggleRTL,
    toggleLayout,
    toggleAnimation,
    toggleMenu,
    toggleNavbar,
    toggleSemidark,
  } = useToggles();
  return (
    <div>
      <div
        className={`${
          (showCustomizer && "!block") || ""
        } fixed inset-0 bg-[black]/60 z-[51] px-4 hidden transition-[display]`}
        onClick={() => setShowCustomizer(false)}
      ></div>

      <nav
        className={`${
          showCustomizer ? "ltr:!right-0 rtl:!left-0" : ""
        } bg-white fixed ltr:-right-[400px] rtl:-left-[400px] top-0 bottom-0 w-full max-w-[400px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 z-[51] dark:bg-black p-4`}
      >
        <button
          type="button"
          className="bg-primary ltr:rounded-tl-full rtl:rounded-tr-full ltr:rounded-bl-full rtl:rounded-br-full absolute ltr:-left-12 rtl:-right-12 top-0 bottom-0 my-auto w-12 h-10 flex justify-center items-center text-white cursor-pointer"
          onClick={() => setShowCustomizer(!showCustomizer)}
        >
        {SettingsIcon}
        </button>

        <div className="overflow-y-auto overflow-x-hidden perfect-scrollbar h-full">
          <div className="text-center relative pb-5">
            <button
              type="button"
              className="absolute top-0 ltr:right-0 rtl:left-0 opacity-30 hover:opacity-100 dark:text-white"
              onClick={() => setShowCustomizer(false)}
            >
              {/* Close Icon SVG */}
            </button>

            <h4 className="mb-1 dark:text-white">TEMPLATE CUSTOMIZER</h4>
            <p className="text-white-dark">
              Set preferences that will be cookied for your live preview
              demonstration.
            </p>
          </div>

          {/* Color Scheme Section */}
          <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
            <h5 className="mb-1 text-base dark:text-white leading-none">
              Color Scheme
            </h5>
            <p className="text-white-dark text-xs">
              Overall light or dark presentation.
            </p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <ToggleButton
                label="Light"
                isActive={toggles.theme === "light"}
                onClick={() => toggleTheme.mutate("light")}
                icon={LightIcon}
              />
              <ToggleButton
                label="Dark"
                isActive={toggles.theme === "dark"}
                onClick={() => toggleTheme.mutate("dark")}
                icon={DarkIcon }
              />
              <ToggleButton
                label="System"
                isActive={toggles.theme === "system"}
                onClick={() => toggleTheme.mutate("system")}
                icon={SystemIcon}
              />
            </div>
          </div>

          {/* Navigation Position Section */}
          <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
            <h5 className="mb-1 text-base dark:text-white leading-none">
              Navigation Position
            </h5>
            <p className="text-white-dark text-xs">
              Select the primary navigation paradigm for your app.
            </p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <ToggleButton
                label="Horizontal"
                isActive={toggles.menu === "horizontal"}
                onClick={() => toggleMenu.mutate("horizontal")}
              />
              <ToggleButton
                label="Vertical"
                isActive={toggles.menu === "vertical"}
                onClick={() => toggleMenu.mutate("vertical")}
              />
              <ToggleButton
                label="Collapsible"
                isActive={toggles.menu === "collapsible-vertical"}
                onClick={() => toggleMenu.mutate("collapsible-vertical")}
              />
            </div>
            <div className="mt-5 text-primary">
              <label className="inline-flex mb-0">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={toggles.semidark}
                  onChange={(e) => toggleSemidark.mutate(e.target.checked)}
                />
                <span>Semi Dark (Sidebar & Header)</span>
              </label>
            </div>
          </div>

          {/* Layout Style Section */}
          <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
            <h5 className="mb-1 text-base dark:text-white leading-none">
              Layout Style
            </h5>
            <p className="text-white-dark text-xs">
              Select the primary layout style for your app.
            </p>
            <div className="flex gap-2 mt-3">
              <ToggleButton
                label="Box"
                isActive={toggles.layout === "boxed-layout"}
                onClick={() => toggleLayout.mutate("boxed-layout")}
              />
              <ToggleButton
                label="Full"
                isActive={toggles.layout === "full"}
                onClick={() => toggleLayout.mutate("full")}
              />
            </div>
          </div>

          {/* Direction Section */}
          <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
            <h5 className="mb-1 text-base dark:text-white leading-none">
              Direction
            </h5>
            <p className="text-white-dark text-xs">
              Select the direction for your app.
            </p>
            <div className="flex gap-2 mt-3">
              <ToggleButton
                label="LTR"
                isActive={toggles.rtlClass === "ltr"}
                onClick={() => toggleRTL.mutate("ltr")}
              />
              <ToggleButton
                label="RTL"
                isActive={toggles.rtlClass === "rtl"}
                onClick={() => toggleRTL.mutate("rtl")}
              />
            </div>
          </div>

          {/* Navbar Type Section */}
          <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
            <h5 className="mb-1 text-base dark:text-white leading-none">
              Navbar Type
            </h5>
            <p className="text-white-dark text-xs">Sticky or Floating.</p>
            <div className="mt-3 flex items-center gap-3 text-primary">
              <Label className="inline-flex mb-0">
                <input
                  type="radio"
                  checked={toggles.navbar === "navbar-sticky"}
                  value="navbar-sticky"
                  className="form-radio"
                  onChange={() => toggleNavbar.mutate("navbar-sticky")}
                />
                <span>Sticky</span>
              </Label>
              <Label className="inline-flex mb-0">
                <input
                  type="radio"
                  checked={toggles.navbar === "navbar-floating"}
                  value="navbar-floating"
                  className="form-radio"
                  onChange={() => toggleNavbar.mutate("navbar-floating")}
                />
                <span>Floating</span>
              </Label>
              <Label className="inline-flex mb-0">
                <input
                  type="radio"
                  checked={toggles.navbar === "navbar-static"}
                  value="navbar-static"
                  className="form-radio"
                  onChange={() => toggleNavbar.mutate("navbar-static")}
                />
                <span>Static</span>
              </Label>
            </div>
          </div>

          {/* Router Transition Section */}
          <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
            <h5 className="mb-1 text-base dark:text-white leading-none">
              Router Transition
            </h5>
            <p className="text-white-dark text-xs">
              Animation of main content.
            </p>
            <div className="mt-3">
              <select
                className="form-select border-primary text-primary"
                value={toggles.animation}
                onChange={(e) => toggleAnimation.mutate(e.target.value)}
              >
                <option value=" ">Select Animation</option>
                <option value="animate__fadeIn">Fade</option>
                <option value="animate__fadeInDown">Fade Down</option>
                <option value="animate__fadeInUp">Fade Up</option>
                <option value="animate__fadeInLeft">Fade Left</option>
                <option value="animate__fadeInRight">Fade Right</option>
                <option value="animate__slideInDown">Slide Down</option>
                <option value="animate__slideInLeft">Slide Left</option>
                <option value="animate__slideInRight">Slide Right</option>
                <option value="animate__zoomIn">Zoom In</option>
              </select>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default PageSetting;
