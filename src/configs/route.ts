import { createPermanentPassword, redirectResetPassword, resendOTPAuthEndPoint, twoFactorAuthEndPoint, userGetProfile, userLogin, usersForgetPassword, usersLogout, usersResetpassword, usersValidateOtp } from "src/constants/routeEndpoint";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
}

export interface ApiRoute {
  endPoint: string;
  method: HttpMethod;
  payload?: Record<any, any>;
  params?: string;
};

export const login = (payload: Record<string, any>): ApiRoute => ({
  endPoint: userLogin,
  method: HttpMethod.PATCH,
  payload: payload,
});
export const GetProfile = (payload: Record<string, any>): ApiRoute => ({
  endPoint: userGetProfile,
  method: HttpMethod.GET,
});

export const forgetPassword = (payload: Record<string, any>): ApiRoute => ({
  endPoint: usersForgetPassword,
  method: HttpMethod.PATCH,
  payload: payload,
});

export const logout = (payload: Record<string, any>): ApiRoute => ({
  endPoint: usersLogout,
  method: HttpMethod.PATCH,
  payload: payload,
});

export const resetpassword = (payload: Record<string, any>): ApiRoute => ({
  endPoint: usersResetpassword,
  method: HttpMethod.PATCH,
  payload: payload,
});

export const validateOtp = (payload: Record<string, any>): ApiRoute => ({
  endPoint: usersValidateOtp,
  method: HttpMethod.PATCH,
  payload: payload,
});

export const resetPasswordRedirect = (payload: Record<string, any>): ApiRoute => ({
  endPoint: redirectResetPassword,
  method: HttpMethod.PATCH,
  payload: payload,
});

export const createPassword = (payload: Record<string, any>): ApiRoute => ({
  endPoint: createPermanentPassword,
  method: HttpMethod.POST,
  payload: payload,
});

export const twoFactorAuth = (payload: Record<string, any>): ApiRoute => ({
  endPoint: twoFactorAuthEndPoint,
  method: HttpMethod.POST,
  payload: payload,
});

export const resendOTP = (payload: Record<string, any>): ApiRoute => ({
  endPoint: resendOTPAuthEndPoint,
  method: HttpMethod.PATCH,
  payload: payload,
})
