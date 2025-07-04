import React, { useCallback } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRevokeMfa } from "../hooks/useRevokeMfa";

const RevokeMfa: React.FC = () => {
  const { mutate, isPending } = useRevokeMfa();

  const handleClick = useCallback(() => {
    mutate();
  }, []);

  return (
    <Button
      disabled={isPending}
      className="h-[35px] !text-[#c40006d3] bg-red-100 shadow-none mr-1"
      onClick={handleClick}
    >
      {isPending && <Loader className="animate-spin" />}
      Revoke Access
    </Button>
  );
};

export default RevokeMfa;
