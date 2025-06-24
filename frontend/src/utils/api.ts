import { User } from "@/components/providers/AuthProvider";
import httpClient from "./httpClient";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Currency {
  code: string;
  flag: string;
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
}

export interface ConversionData {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
}

export interface ConversionResult {
  id: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ConversionResponse {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  timestamp: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

export interface ChartData {
  date: string;
  count: number;
  totalAmount: number;
}

export interface DashboardStats {
  totalConversions: number;
  totalCurrencyPairs: number;
  currencyStats: {
    currency: string;
    conversionCount: number;
    totalConverted: number;
  }[];
}

export const authApi = {
  login: async (
    credentials: LoginCredentials
  ): Promise<{ data: AuthResponse; message: string }> => {
    const response = await httpClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (
    userData: RegisterData
  ): Promise<{ data: AuthResponse; message: string }> => {
    const response = await httpClient.post("/auth/register", userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await httpClient.get("/auth/profile");
    return response.data.data.user;
  },
};

export const conversionApi = {
  convert: async (
    conversionData: ConversionData
  ): Promise<ConversionResult> => {
    const response = await httpClient.post("/conversions", conversionData);
    return response.data.data;
  },

  getSupportedCurrencies: async (): Promise<Currency[]> => {
    const response = await httpClient.get("/conversions/currencies");
    return response.data.data.currencies;
  },

  getChartData: async (period: string): Promise<{ chartData: ChartData[] }> => {
    const response = await httpClient.get(`/dashboard/chart?period=${period}`);
    return response.data.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await httpClient.get("/dashboard/stats");
    return response.data.data;
  },

  getConversionHistory: async (
    params?: PaginationParams
  ): Promise<{ conversions: ConversionResponse[]; pagination: Pagination }> => {
    const queryParams = params
      ? Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      : {};

    const response = await httpClient.get(
      `/conversions?${new URLSearchParams(queryParams)}`
    );
    return response.data.data;
  },
};

export const api = {
  auth: authApi,
  conversion: conversionApi,
};
