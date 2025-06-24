"use client";

import { ArrowUpDown, RefreshCw } from "lucide-react";
import { CurrencySelect } from "../ui/currency-select";
import { useConversion } from "@/hooks";
import CurrencyInput from "react-currency-input-field";
import { Button } from "../ui/button";

export function ConversionForm() {
  const {
    result,
    rotated,
    formData,
    currencies,
    conversionMutation,
    setFormData,
    handleSubmit,
    swapCurrencies,
  } = useConversion();

  return (
    <div className="max-w-2xl mx-auto min-w-[375px]">
      <div className="shadow-lg rounded-lg p-6 backdrop-blur-2xl bg-[rgba(241,242,244,0.8)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white px-3 py-2 rounded-2xl flex flex-col w-full">
            <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <CurrencyInput
              name="fromAmount"
              decimalsLimit={2}
              allowNegativeValue={false}
              value={formData.fromAmount ?? 0}
              className="h-full w-full min-w-0 flex-1 bg-transparent px-px text-2xl outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 font-bold !text-gray-700"
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  fromAmount: value ? Number(value) : 0,
                })
              }
            />
          </div>

          <div className="relative">
            <CurrencySelect
              label="Convert From"
              currencies={currencies}
              value={formData.fromCurrency}
              onChange={(value) =>
                setFormData({ ...formData, fromCurrency: value })
              }
            />

            <div className="mt-2">
              <CurrencySelect
                to
                label="Converting To"
                currencies={currencies}
                value={formData.toCurrency}
                onChange={(value) =>
                  setFormData({ ...formData, toCurrency: value })
                }
              />
            </div>

            <div className="flex w-full justify-center absolute top-12 right-0">
              <button
                type="button"
                onClick={swapCurrencies}
                className={`p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white transform transition-transform duration-1000 ease-in-out ${
                  rotated ? "rotate-180" : "rotate-0"
                }`}
              >
                <ArrowUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <Button
            type="submit"
            loading={conversionMutation.isPending}
            disabled={conversionMutation.isPending}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Convert Currency
          </Button>
        </form>

        {/* Result Display */}
        {result && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-xl font-medium text-gray-900">
                {formData.fromAmount.toLocaleString()} {result.fromCurrency}
              </p>
              <p className="text-sm font-medium text-gray-900">=</p>
              <p className="text-xl font-bold text-gray-900">
                {result.toAmount.toLocaleString()} {result.toCurrency}
              </p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs font-bold text-gray-600">Current rate</p>
              <p className="text-sm font-medium text-gray-900">
                {`1 ${
                  result.fromCurrency
                } = ${result.exchangeRate.toLocaleString()} ${
                  result.toCurrency
                }`}
              </p>
            </div>

            <div className="text-sm text-green-700 dark:text-green-400">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                Converted on {new Date(result.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
        {/* Error Display */}
        {conversionMutation.error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-sm text-red-600 dark:text-red-400">
            {conversionMutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
}
