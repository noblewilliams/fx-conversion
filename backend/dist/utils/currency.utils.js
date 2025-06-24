"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrenciesWithFlags = exports.currencyFlagMap = void 0;
exports.currencyFlagMap = {
    USD: "🇺🇸",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
    JPY: "🇯🇵",
    NGN: "🇳🇬",
    CAD: "🇨🇦",
    AUD: "🇦🇺",
    CHF: "🇨🇭",
    CNY: "🇨🇳",
    SEK: "🇸🇪",
    NZD: "🇳🇿",
    MXN: "🇲🇽",
    SGD: "🇸🇬",
    HKD: "🇭🇰",
    NOK: "🇳🇴",
    INR: "🇮🇳",
};
const getCurrenciesWithFlags = (codes) => {
    return codes.map((code) => ({
        code,
        flag: exports.currencyFlagMap[code] || "",
    }));
};
exports.getCurrenciesWithFlags = getCurrenciesWithFlags;
