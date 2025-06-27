import axios from "axios";
import queryClient from "./query-client";
import { navigate } from "@/lib/navigation";
import { apiRoutes, appRoutes } from "@/constants/app-routes";

export const UNAUTHORIZED = 401;

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const API = axios.create(options);
API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error;
    const { status, data } = response || {};

    if (status === UNAUTHORIZED && data?.errorCode === "InvalidAccessToken") {
      try {
        await TokenRefreshClient.get(apiRoutes.auth.refresh);
        return TokenRefreshClient(config);
      } catch (error) {
        queryClient.clear();
        navigate(appRoutes.auth.login, {
          state: {
            redirectUrl: window.location.pathname,
          },
        });
      }
    }
    return Promise.reject({ status, ...data });
  }
);

export default API;
