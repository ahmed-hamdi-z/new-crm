import axios from "axios";
import { apiRoutes } from "@/constants/app-routes";
import { ErrorCode } from "@/types/error-code";

export const UNAUTHORIZED = 401;

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

const API = axios.create(options);

export const APIRefresh = axios.create(options);
APIRefresh.interceptors.response.use((response) => response);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response;
    if (data.errorCode === "AUTH_TOKEN_NOT_FOUND" && status === 401) {
      try {
        await APIRefresh.get(apiRoutes.auth.refresh);
        return APIRefresh(error.config);
      } catch (error) {
        console.log(error);
        window.location.href = "/";
      }
    }
    if (data.errorCode === "ACCESS_UNAUTHORIZED") {
      window.location.href = "/";
      return;
    }

    const customError: ErrorCode = {
      ...error,
      errorCode: data.errorCode || "UNKNOWN_ERROR",
    };
    

    return Promise.reject({
      ...data, customError,
    });
  }
);

export default API;
