export interface CurrencyFlag {
  code: string;
  flag: string;
}

export const currencyFlagMap: Record<string, string> = {
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

export const getCurrenciesWithFlags = (codes: string[]): CurrencyFlag[] => {
  return codes.map((code) => ({
    code,
    flag: currencyFlagMap[code] || "",
  }));
};
