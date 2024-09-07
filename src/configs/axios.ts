"use client";
import axios from "axios";
import { ROOT_BASE_API } from "src/store/apps";
import { ApiRoute, HttpMethod } from "./route";
import AppEvent from "src/app/AppEvent";

const urlToExclude = ["uniquecodecheck", "toggle", "code", "checkbarcodeunique"];

export const axiosInstance = axios.create({
  baseURL: ROOT_BASE_API,
  withCredentials: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(function (config) {
  let token = localStorage.getItem("accessToken");
  token = token ? `Bearer ${token}` : null;
  //@ts-ignore
  config.headers["Authorization"] = token;
  return config;
});

// **enable this after BE Deploy

axiosInstance.interceptors.response.use(
  function (response) {
    // Do something with successful response
    const endPoint = new URL(response?.request?.responseURL as string);
    let checkEndPoint:any = endPoint?.pathname?.split("/");
    checkEndPoint = checkEndPoint[checkEndPoint?.length - 1];
    if (
      response?.data?.message &&
      !urlToExclude.includes(checkEndPoint as string)
    ) {
      AppEvent.messageEmit({
        type: "success",
        message: response?.data?.message || "Success",
      });
    }
    return response;
  },
  function (error) {
    if (error?.code == "ERR_NETWORK") {
      AppEvent.messageEmit({
        type: "error",
        message: "No Internet",
      });
    } else if (error?.response) {
      if (error?.response?.data?.error?.message) {
        AppEvent.messageEmit({
          type: "error",
          message: error?.response?.data?.error?.message,
        });
      } else
        AppEvent.messageEmit({
          type: "error",
          message: error?.response?.data,
        });
    } else {
      console.log(error);
    }
    // Handle other error cases if needed
    return Promise.reject(error);
  }
);

const api = async ({ endPoint, method, params, payload = {} }: ApiRoute) => {
  try {
    switch (method) {
      case HttpMethod.GET:
        return await axiosInstance.get(endPoint, { params });
      case HttpMethod.POST:
        return await axiosInstance.post(endPoint, payload, { params });
      case HttpMethod.PUT:
        return await axiosInstance.put(endPoint, payload, { params });
      case HttpMethod.DELETE:
        return await axiosInstance.delete(endPoint, { params });
      case HttpMethod.PATCH:
        return await axiosInstance.patch(endPoint, payload, { params });
      case HttpMethod.OPTIONS:
        return await axiosInstance.options(endPoint, { params });
      case HttpMethod.HEAD:
        return await axiosInstance.head(endPoint, { params });
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  } catch (error) {
    console.error("Error in API", endPoint, method);
  }
};

export default api;
