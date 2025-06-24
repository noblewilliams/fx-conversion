import axios from "axios";
import { ExchangeRateResponse } from "../types";
import { createError } from "../middleware/error.middleware";

class ExchangeRateService {
  private readonly baseUrl = "https://api.exchangerate.host";
  private readonly apiKey = process.env.EXCHANGE_RATE_API_KEY || "";
  private readonly cache = new Map<
    string,
    { rate: number; timestamp: number }
  >();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    if (!this.apiKey) {
      console.warn(
        "Exchange rate API key not set. Please add EXCHANGE_RATE_API_KEY to your .env file."
      );
    }
  }

  async getExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const cacheKey = `${fromCurrency}-${toCurrency}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.rate;
    }

    try {
      let url = `${this.baseUrl}/convert?from=${fromCurrency}&to=${toCurrency}&amount=1`;
      if (this.apiKey) {
        url += `&access_key=${this.apiKey}`;
      }
      const response = await axios.get<ExchangeRateResponse>(url, {
        timeout: 10000,
      });

      if (!response.data || typeof response.data.result !== "number") {
        throw createError("Invalid response from exchange rate API", 502);
      }

      const rate = response.data.result;
      this.cache.set(cacheKey, { rate, timestamp: Date.now() });

      return rate;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Exchange rate API error:", error.message);
        throw createError("Failed to fetch exchange rate", 502);
      }
      throw error;
    }
  }

  async getSupportedCurrencies(): Promise<string[]> {
    return [
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "NGN",
      "CAD",
      "AUD",
      "CHF",
      "CNY",
      "SEK",
      "NZD",
      "MXN",
      "SGD",
      "HKD",
      "NOK",
      "INR",
    ];
  }

  convertAmount(amount: number, exchangeRate: number): number {
    return Math.round(amount * exchangeRate * 100) / 100;
  }
}

export const exchangeRateService = new ExchangeRateService();
