import { Request } from "express";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversion {
  id: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  createdAt: Date;
  user?: User;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ConversionRequest {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
}

export interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
  result?: number; // For convert endpoint
}

export interface CurrencyStats {
  currency: string;
  totalConverted: number;
  conversionCount: number;
}

export interface DashboardStats {
  totalConversions: number;
  totalCurrencyPairs: number;
  currencyStats: CurrencyStats[];
  recentConversions: Conversion[];
}
