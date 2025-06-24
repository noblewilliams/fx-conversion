"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeRateService = void 0;
const axios_1 = __importDefault(require("axios"));
const error_middleware_1 = require("../middleware/error.middleware");
class ExchangeRateService {
    constructor() {
        this.baseUrl = "https://api.exchangerate.host";
        this.apiKey = process.env.EXCHANGE_RATE_API_KEY || "";
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        if (!this.apiKey) {
            console.warn("Exchange rate API key not set. Please add EXCHANGE_RATE_API_KEY to your .env file.");
        }
    }
    getExchangeRate(fromCurrency, toCurrency) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const response = yield axios_1.default.get(url, {
                    timeout: 10000,
                });
                if (!response.data || typeof response.data.result !== "number") {
                    throw (0, error_middleware_1.createError)("Invalid response from exchange rate API", 502);
                }
                const rate = response.data.result;
                this.cache.set(cacheKey, { rate, timestamp: Date.now() });
                return rate;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error("Exchange rate API error:", error.message);
                    throw (0, error_middleware_1.createError)("Failed to fetch exchange rate", 502);
                }
                throw error;
            }
        });
    }
    getSupportedCurrencies() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    convertAmount(amount, exchangeRate) {
        return Math.round(amount * exchangeRate * 100) / 100;
    }
}
exports.exchangeRateService = new ExchangeRateService();
