"use client";

// ** React Imports
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

// ** Next Import
import { useRouter } from "next/router";

// ** Axios

// ** Config
import authConfig from "src/configs/auth";

// ** Types
import axios from "axios";
import { useTranslation } from "react-i18next";
import AppEvent from "src/app/AppEvent";
import api, { axiosInstance } from "src/configs/axios";
import io from "socket.io-client";
import {
  forgetPassword,
  login,
  resetPasswordRedirect,
  resetpassword,
  createPassword,
  twoFactorAuth,
  resendOTP,
  GetProfile,
} from "src/configs/route";
import { setEmail } from "src/store/apps/form/formdataSlice";
import {
  AuthValuesType,
  CreatePassword,
  TwoFactorAuth,
  ErrCallbackType,
  LoginParams,
  UserDataType,
  resendOTPTypes,
} from "./types";
import { ROOT_BASE_API } from "src/store/apps";

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  isAuthenticUser: false,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise<void>,
  logout: () => Promise<void>,
  register: () => Promise<void>,
  forgetPassword: () => Promise<void>,
  resetpassword: () => Promise<void>,
  validateOtp: () => Promise<void>,
  createPassword: () => Promise<void>,
  twoFactorAuth: () => Promise<void>,
  resendOTP: () => Promise<void>,
  handleResetPasswordRedirectAuth: (
    params: { email: string; token: string },
    cb: (b: boolean) => void,
    err: (mgs: string) => void
  ) => Promise<void>,
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [isAuthenticUser, setAuthenticUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // ** Hooks
  const router = useRouter();

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(
        authConfig.storageTokenKeyName
      )!;

      if (storedToken) {
        setLoading(true);
        //@ts-ignore

        let userData = await api(GetProfile());
        userData = { ...(userData?.data || {}), token: storedToken };
        if (userData) {
          setUser({ ...userData });
          setLoading(false);
        }
        if (
          authConfig.onTokenExpiration === "logout" &&
          !router.pathname.includes("login")
        ) {
          setAuthenticUser(false);
          router.replace("/auth/login");
        }
        if (userData?.isTwoFactorAuth) {
          setAuthenticUser(false);
          router.replace("/auth/two-factor-auth");
        }
        if (userData && !userData?.isTwoFactorAuth) setAuthenticUser(true);
      } else {
        setLoading(false);
        setAuthenticUser(false);
        if (!router.asPath.includes("auth")) {
          router.push("/auth/login");
        }
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    const socket = io(ROOT_BASE_API, { forceNew: true });

    socket.on("updatedPermissions", (data) => {
      if ((data || {})?.status && !router.pathname.startsWith("/auth")) {
        window.location.reload();
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType
  ) => {
    api(login(params))
      .then(async (response) => {
        const accessToken = response?.data?.token;

        if (response?.data?.error) throw response?.data?.error;

        if (accessToken) {
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

            window.localStorage.setItem(
              authConfig.storageTokenKeyName,
              accessToken
            );
          const returnUrl = router.query.returnUrl;
          setUser({ ...response?.data });

          if (params?.rememberMe) {
            window.localStorage.setItem(
              "userData",
              JSON.stringify(response?.data)
            );
          }

          if (response?.data?.isTempPassword) {
            return router.replace("create-password");
          }

          if (response?.data?.isTwoFactorAuth) {
            return router.replace("two-factor-auth");
          }

          const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
          router.replace(redirectURL as string);
        } else {
          // Handle the case where the API response does not contain an access token.
          // You can add error handling logic here if needed.
          // if (errorCallback) errorCallback(new Error("Access token not found in response"));
          throw new Error(response?.data?.error);
        }
      })
      .catch((err) => {
        // Handle API request errors here
        if (errorCallback) errorCallback(err);
      });
  };

  const handleForgetPassword = (params: any, loading: (a: boolean) => void) => {
    api(forgetPassword(params))
      .then(async (response) => {
        if (!response?.data?.error) {
          router.push("/auth/login");
          dispatch(setEmail(""));
        }
      })
      .catch((err) => {
        AppEvent.messageEmit({
          type: "error",
          message: t("SOMETHING_WENT_WRONG"),
        });
      })
      .finally(() => loading(false));
  };

  const handleResetPassword = (
    params: any,
    cb?: (v: boolean) => void,
    err?: (msg: string) => void
  ) => {
    api(resetpassword(params))
      .then(async (response) => {
        if (response?.data?.error) {
          if (response?.data?.error?.message)
            if (err) err(t("Send Reset Password Email Again"));
        } else {
          router.push("/auth/login");
        }
        // Handle successful password reset, e.g., show a success message.
        // You can also redirect the user to a login page or any other appropriate action.
      })
      .catch((err) => {
        AppEvent.messageEmit({
          type: "error",
          message: t("SOMETHING_WENT_WRONG"),
        });
        if (cb) cb(false);
        // Handle the error, e.g., display an error message to the user.
      })
      .finally(() => {
        if (cb) cb(false);
      });
  };

  const handleLogout = (
    redirect = true,
    message: undefined | string = undefined
  ) => {
    localStorage.clear();
    setUser(null);
    setAuthenticUser(false);
    if (redirect) {
      AppEvent.messageEmit({
        type: "success",
        message: message ?? "User logged out successfully",
      });
      router.push("/auth/login");
    }
  };

  const handleValidateOtp = (params: any, errorCallback?: ErrCallbackType) => {
    api(resetpassword(params))
      .then(async (response) => {
        // Handle successful password reset, e.g., show a success message.
        // You can also redirect the user to a login page or any other appropriate action.
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
        // Handle the error, e.g., display an error message to the user.
      });
  };

  const handleRegister = (params: any, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then((res) => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error);
        }
      })
      .catch((err: { [key: string]: string }) =>
        errorCallback ? errorCallback(err) : null
      );
  };

  const handleResetPasswordRedirectAuth = (
    params: { email: string; token: string },
    loading: (b: boolean) => void,
    err: (mgs: string) => void
  ) => {
    api(resetPasswordRedirect(params))
      .then((d) => {
        if (!d?.data.redirect) {
          err(d?.data?.error?.message || "RESET_PASSWORD_AGAIN");
        }
      })
      .catch(console.error)
      .finally(() => loading(false));
  };

  const handleCreatePassword = (
    params: CreatePassword,
    errorCallback?: ErrCallbackType
  ) => {
    api(createPassword(params))
      .then(async (response) => {
        if (response?.data?.message)
          handleLogout(true, "Password created successfully. Kindly re-login");
      })
      .catch((err) => {
        // Handle API request errors here
        if (errorCallback) errorCallback(err);
      });
  };

  const handleTwoFactorAuth = (
    params: TwoFactorAuth,
    errorCallback?: ErrCallbackType
  ) => {
    api(twoFactorAuth(params))
      .then(async (response) => {
        let updateUserData = localStorage.getItem("userData") as string;

        updateUserData = {
          ...JSON.parse(updateUserData),
          isTwoFactorAuth: false,
        };

        if (response?.data?.status) {
          if (user) {
            window.localStorage.setItem(
              "userData",
              JSON.stringify(updateUserData)
            );
            router.replace("/");
          }
        } else {
          if (errorCallback) errorCallback(response?.data?.message);
        }
      })
      .catch((err) => {
        // Handle API request errors here
        if (errorCallback) errorCallback(err);
      });
  };

  const handleResendOTP = (params: resendOTPTypes) => {
    api(resendOTP(params))
      .then(async (response) => {
        
      })
      .catch((e) => {
        AppEvent.messageEmit({
          type: "error",
          message: "something went wrong!",
        });
      });
  };

  const values = useMemo<AuthValuesType>(
    () => ({
      user,
      loading,
      setUser,
      setLoading,
      isAuthenticUser,
      login: handleLogin,
      logout: handleLogout,
      register: handleRegister,
      forgetPassword: handleForgetPassword,
      resetpassword: handleResetPassword,
      validateOtp: handleValidateOtp,
      createPassword: handleCreatePassword,
      twoFactorAuth: handleTwoFactorAuth,
      resendOTP: handleResendOTP,
      handleResetPasswordRedirectAuth,
    }),
    [
      user,
      loading,
      setUser,
      setLoading,
      handleLogin,
      handleLogout,
      handleRegister,
      handleForgetPassword,
      handleResetPassword,
      handleValidateOtp,
      handleResetPasswordRedirectAuth,
      isAuthenticUser,
    ]
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
