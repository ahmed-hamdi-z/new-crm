import { useCallback } from "react";

const useGoToTop = () => {
  const goToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { goToTop };
};

export default useGoToTop;
