import React from "react";
import { SvgCaret } from "@/assets/icons";
import { Currency } from "@/utils";

export const CurrencySelect = ({
  to = false,
  label,
  value,
  onChange,
  currencies,
}: {
  to?: boolean;
  label: string;
  value: string;
  currencies: Currency[];
  onChange: (e: string) => void;
}) => {
  const [search, setSearch] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  const getFlag = (code: string) =>
    currencies?.find((c) => c.code === code)?.flag || "";

  return (
    <div
      ref={containerRef}
      className={`bg-white px-3 py-2 rounded-2xl flex flex-col w-full ${
        to ? "items-end" : "items-start"
      }`}
    >
      {label && (
        <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div
        className={`relative w-full flex ${
          to ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {getFlag(value)} {value}
          </p>
          <SvgCaret className="w-4 h-4" />
        </div>

        <div
          className={`absolute z-20 top-0 left-0 w-full bg-white rounded-2xl shadow-lg max-h-60 overflow-y-auto origin-top transform transition-all duration-200 ease-out ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="sticky top-0 bg-white">
            <input
              type="text"
              value={search}
              placeholder="Search currencies"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 focus:outline-none dark:text-white"
            />
            <div className="h-px bg-gray-200 w-full" />
          </div>

          <div className="flex flex-col gap-2">
            {currencies
              .filter((currency) =>
                currency.code.toLowerCase().includes(search.toLowerCase())
              )
              .map((currency) => (
                <div
                  key={currency.code}
                  className="p-2 text-gray-500 cursor-pointer hover:bg-gray-50 transition-all duration-700 ease-in-out"
                  onClick={() => {
                    onChange(currency.code);
                    setIsOpen(false);
                  }}
                >
                  {currency.flag} {currency.code}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
