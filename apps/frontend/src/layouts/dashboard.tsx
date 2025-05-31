import { PropsWithChildren, Suspense, useEffect, useState } from "react";
import ThemeProvider from "@/components/global/theme-provider";
// import Footer from './Footer';
// import Header from './Header';
import PageSetting from "@/components/dashboard/page-settings";
import Loader from "@/components/global/loader";
import { useToggles } from "@/hooks/toggles";
import useGoToTop from "@/hooks/global/useGoToTop";

// import Sidebar from './Sidebar';
// import Portals from '@/components/Portals';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const { toggles, toggleSidebar } = useToggles();

  const [showLoader, setShowLoader] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  const { goToTop } = useGoToTop();

  const onScrollHandler = () => {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      setShowTopButton(true);
    } else {
      setShowTopButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScrollHandler);

    return () => {
      window.removeEventListener("onscroll", onScrollHandler);
    };
  }, []);

  return (
    <ThemeProvider>
      {/* BEGIN MAIN CONTAINER */} 
      <div className="relative">
        {/* sidebar menu overlay */}
        <div
          className={`${
            (!toggles.sidebar && "hidden") || ""
          } fixed inset-0 bg-[black]/60 z- 50 lg:hidden`}
          onClick={() => toggleSidebar}
        ></div>
        {/* screen loader */}
        {showLoader && <Loader onFadeOut={() => setShowLoader(false)} />}

        <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-50">  
          {showTopButton && (
            <button
              type="button"
              className="btn btn-outline-primary rounded-full p-2 animate-pulse bg-[#fafafa] dark:bg-[#060818] dark:hover:bg-primary"
              onClick={goToTop}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7l4-4m0 0l4 4m-4-4v18"
                />
              </svg>
            </button>
          )}
        </div>

        {/* BEGIN APP SETTING LAUNCHER */}
        <PageSetting />
        {/* END APP SETTING LAUNCHER */}

        <div
          className={`${toggles.navbar} main-container text-black dark:text-white-dark min-h-screen`}
        >
          {/* BEGIN SIDEBAR */}
          {/* <Sidebar /> */}Sidebar
          {/* END SIDEBAR */}
          {/* BEGIN CONTENT AREA */}
          <div className="main-content">
            {/* BEGIN TOP NAVBAR */}
            {/* <Header /> */}Header
            {/* END TOP NAVBAR */}
            <Suspense>
              <div className={`${toggles.animation} p-6 animate__animated`}>
                {children}
                {/* BEGIN FOOTER */}
                {/* <Footer /> */}Footer
                {/* END FOOTER */}
              </div>
            </Suspense>
            {/* <Portals /> */}
          </div>
          {/* END CONTENT AREA */}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DashboardLayout;
