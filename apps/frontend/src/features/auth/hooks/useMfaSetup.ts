import { useQuery } from "@tanstack/react-query";
import { mfaSetupApi } from "../apis";
import { mfaType } from "../types";

interface UseMfaSetupOptions {
  enabled?: boolean;
}

const useMfaSetup = (options: UseMfaSetupOptions = {}) => {
  const query = useQuery<mfaType>({
    queryKey: ["mfa-setup"],
    queryFn: mfaSetupApi,
    enabled: options.enabled ?? false,
    staleTime: Infinity,
  });
  return query;
};

export default useMfaSetup;
