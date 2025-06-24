/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

export * from "./api";

export const ErrorToast = (message: string) => {
  toast.error(message);
};

export const SuccessToast = (message: string) => {
  toast.success(message);
};

export const parseError = (error: any) => {
  if (error.response) {
    return error.response.data.message;
  }
  return error.message;
};
