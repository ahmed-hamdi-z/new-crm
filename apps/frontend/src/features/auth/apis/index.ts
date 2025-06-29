import API from "@/config/api-client";
import { forgotPasswordType, LoginResponseType, loginType, registerType } from "../types";
import { apiRoutes } from "@/constants/app-routes";

const loginApi = async (data: loginType): Promise<LoginResponseType> =>
  await API.post(apiRoutes.auth.login, data);

const registerApi = async (data: registerType) =>
  await API.post(apiRoutes.auth.register, data);

export const forgotPasswordApi = async (data: forgotPasswordType) =>
  await API.post(apiRoutes.auth.forgotPassword, data);

export { loginApi, registerApi };
