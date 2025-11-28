import Axios, {
  AxiosError as OriginalAxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import qs from "qs";

import storage from "utils/storage";

import { API_URL } from "config";
import { useNotificationStore } from "stores/notifications";
import { FastApiError } from "types";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (!config.headers) {
    config.headers = {} as AxiosHeaders;
  }

  const token = storage.getToken();
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  config.headers.Accept = "application/json";

  return config;
}

export type AxiosError = OriginalAxiosError<FastApiError>;

export const axios = Axios.create({
  baseURL: API_URL,
  paramsSerializer: function (params) {
    // make arrays in query params match FastAPI array format: https://fastapi.tiangolo.com/tutorial/query-params-str-validations/#query-parameter-list-multiple-values
    return qs.stringify(params, { arrayFormat: "repeat" });
  },
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    switch (error.response?.status) {
      // Axios handles 3xx status codes as errors by default.
      case 304:
        return Promise.reject(error);

      case 401:
        storage.clearToken();
        window.location.href = "/auth/login";
        return Promise.reject(error);

      case 403:
      case 404:
        return Promise.reject(error);

      default: {
        const message =
          typeof error.response?.data?.detail === "string"
            ? error.response?.data?.detail
            : // In case of validation errors, FastAPI returns an object with more specific details.
              // For now we'll just print the object as a string.
              // TODO: Write reusable method to convert this to a printable string.
              JSON.stringify(error.response?.data?.detail);

        useNotificationStore.getState().addNotification({
          type: "error",
          title: `Error ${error.response?.status}`,
          message,
        });
        console.error(`Error ${error.response?.status}:`, message);
        return Promise.reject(error);
      }
    }
  },
);

export {};
