import API from "@/config/api-client";
import {
  forgotPasswordType,
  UserResponseType,
  loginType,
  registerType,
  resetPasswordType,
  verifyEmailType,
  verifyMFAType,
  mfaType,
  mfaLoginType,
  SessionResponseType,
} from "../types";
import { apiRoutes } from "@/constants/app-routes";

const loginApi = async (data: loginType): Promise<UserResponseType> => {
  const response = await API.post(apiRoutes.auth.login, data);
  return response.data;
};
const registerApi = async (data: registerType) =>
  await API.post(apiRoutes.auth.register, data);

const forgotPasswordApi = async (data: forgotPasswordType) =>
  await API.post(apiRoutes.auth.forgotPassword, data);

const resetPasswordApi = async (data: resetPasswordType) =>
  await API.post(apiRoutes.auth.resetPassword, data);

const verifyEmailApi = async (data: verifyEmailType) =>
  await API.post(apiRoutes.auth.verifyEmail, data);

const getUserSessionApi = async () => await API.get(apiRoutes.auth.session);

const verifyMFASetupApi = async (data: verifyMFAType) =>
  await API.post(apiRoutes.auth.mfaVerifySetup, data);

const verifyMFALoginApi = async (
  data: mfaLoginType
): Promise<UserResponseType> =>
  await API.post(apiRoutes.auth.mfaVerifyLogin, data);

const logoutApi = async () => await API.post(apiRoutes.auth.logout);

const mfaSetupApi = async (): Promise<mfaType> => {
  const response = await API.get<mfaType>(apiRoutes.auth.mfaSetup);
  return response.data;
};
const revokeMFAApi = async () => await API.put(apiRoutes.auth.mafRevoke, {});

const sessionsApi = async () => {
  const response = await API.get<SessionResponseType>(
    apiRoutes.auth.allSessions
  );
  return response.data;
};

const deleteSessionApi = async (id: string) =>
  await API.delete(`/api/session/${id}`);
export {
  loginApi,
  registerApi,
  forgotPasswordApi,
  resetPasswordApi,
  verifyEmailApi,
  verifyMFALoginApi,
  verifyMFASetupApi,
  getUserSessionApi,
  mfaSetupApi,
  revokeMFAApi,
  deleteSessionApi,
  sessionsApi,
  logoutApi,
};
