import API from "@/config/api-client";
import { apiRoutes } from "@/constants/app-routes";

/**
 * Login a user
 * @param {Object} data - Login data
 * @returns {Promise<any>} - User data and tokens
 */
export const loginApi = async (data: any) =>
  API.post(apiRoutes.auth.login, data);

/**
 * Registers a new user
 * @param {Object} data - User data
 * @returns {Promise<any>} - User data and tokens
 */
export const RegisterApi = async (data: any) =>
  API.post(apiRoutes.auth.register, data);

/**
 * Logs out a user
 * @returns {Promise<void>}
 */
export const logoutApi = async () => API.get(apiRoutes.auth.logout);

/**
 * Fetches the current user's data.
 * @param {Object} data - Optional request data to include in the GET request.
 * @returns {Promise<any>} - The current user's data.
 */
export const CurrentUser = async (data: any) =>
  API.get(apiRoutes.user.current, {data});

/**
 * Verifies the email address of a user.
 * @param {string} verificationCode - The verification code sent to the user.
 * @returns {Promise<void>}
 */
export const VerifyEmail = async (verificationCode: any) =>
  API.get(apiRoutes.auth.verifyEmail.replace(":code", verificationCode));

/**
 * Sends a password reset email to the specified email address.
 * @param {string} email - The email address to send the password reset email to.
 * @returns {Promise<any>} - The response from the server after attempting to send the email.
 */
export const SendPasswordResetEmailApi = async (email: string) =>
  API.post(apiRoutes.auth.forgotPassword, { email });

/**
 * Resets the user's password using the provided verification code and new password.
 * @param {Object} param - An object containing the verification code and new password.
 * @param {string} param.verificationCode - The verification code for password reset.
 * @param {string} param.password - The new password to set for the user.
 * @returns {Promise<any>} - The response from the server after attempting to reset the password.
 */
export const ResetPassword = async ({ verificationCode, password }: any) =>
  API.post(apiRoutes.auth.resetPassword, { verificationCode, password });

/**
 * Fetches all the user's active sessions.
 * @returns {Promise<any>} - The active sessions of the user.
 */
export const getSessions = async () => API.get(apiRoutes.auth.sessions);

/**
 * Deletes the session with the specified ID.
 * @param {string} id - The ID of the session to delete.
 * @returns {Promise<void>} - A promise that resolves when the session is deleted.
 */
export const deleteSession = async (id: string) =>
  API.delete(apiRoutes.auth.sessions + `/${id}`);
