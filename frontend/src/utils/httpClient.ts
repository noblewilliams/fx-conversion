import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";
import { ErrorToast } from ".";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined" ? Cookies.get("auth_token") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          if (typeof window !== "undefined") {
            Cookies.remove("auth_token");
          }
          break;

        case 403:
          ErrorToast("Access forbidden");
          break;

        case 404:
          ErrorToast("Resource not found");
          break;

        case 422:
          ErrorToast("Validation errors");
          break;

        case 429:
          ErrorToast("Rate limit exceeded");
          break;

        case 500:
          ErrorToast("Internal server error");
          break;

        default:
          ErrorToast(`HTTP Error ${status}: ${data}`);
      }
    } else if (error.request) {
      ErrorToast("Network error - no response received");
    } else {
      ErrorToast("Request setup error");
    }

    return Promise.reject(error);
  }
);

export default httpClient;
