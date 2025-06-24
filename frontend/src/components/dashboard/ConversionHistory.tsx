/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LoadingSpinner } from "@/components/ui/loader";
import { Calendar, Filter } from "lucide-react";
import { useHistory } from "@/hooks";
import { SelectInput } from "../ui/input";
import { Table } from "../ui/table";

export function ConversionHistory() {
  const {
    data,
    page,
    error,
    filters,
    isLoading,
    currencies,
    setPage,
    setFilters,
  } = useHistory();

  const conversions = data?.conversions || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">
          Failed to load conversion history
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <SelectInput
              label="Select Currency"
              value={filters.currency}
              onChange={(e) =>
                setFilters({ ...filters, currency: e.target.value })
              }
              options={[
                { label: "All", value: "" },
                ...currencies.map((currency) => ({
                  label: `${currency.flag} ${currency.code}`,
                  value: currency.code,
                })),
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Conversions
          </h3>
        </div>

        {conversions.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No conversions found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              page={page}
              setPage={setPage}
              pagination={pagination}
              columns={["From", "To", "Rate", "Date"]}
              rows={conversions.map((conversion: any) => ({
                id: conversion.id,
                data: [
                  {
                    class: "text-gray-900 dark:text-white",
                    value:
                      conversion.fromAmount.toLocaleString() +
                      " " +
                      conversion.fromCurrency,
                  },
                  {
                    class: "text-gray-900 dark:text-white",
                    value:
                      conversion.toAmount.toLocaleString() +
                      " " +
                      conversion.toCurrency,
                  },
                  {
                    class: "text-gray-500 dark:text-gray-400",
                    value: `1 ${
                      conversion.fromCurrency
                    } = ${conversion.exchangeRate.toLocaleString()} ${
                      conversion.toCurrency
                    }`,
                  },
                  {
                    class: "text-gray-500 dark:text-gray-400",
                    value: new Date(conversion.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    ),
                  },
                ],
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
