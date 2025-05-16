import { setNavigate } from "@/lib/navigation";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const NavigationSetup = ({ children }: { children: React.ReactNode }) => {
    const nav = useNavigate();
    
    useEffect(() => {
      setNavigate(nav);
      return () => {
        setNavigate(() => {
          console.warn("Navigator no longer available");
        });
      };
    }, [nav]);
  
    return children;
  };

  export default NavigationSetup;