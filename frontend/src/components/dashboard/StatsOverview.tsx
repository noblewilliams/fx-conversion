"use client";

import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loader";
import { TrendingUp, DollarSign, BarChart } from "lucide-react";
import { useAuth } from "@/hooks";
import { ConversionChart } from "./ConversionChart";
import { api } from "@/utils";

export const AnalyticsOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Insights into your conversion patterns and trends
        </p>
      </div>
      <StatsOverview />
      <ConversionChart />
    </div>
  );
};

export function StatsOverview() {
  const { token } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => api.conversion.getDashboardStats(),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            <LoadingSpinner />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Conversions",
      value: stats?.totalConversions,
      icon: BarChart,
      color: "black",
    },
    {
      title: "Currency Pairs",
      value: stats?.totalCurrencyPairs,
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Top Currency",
      value:
        stats?.currencyStats.find(
          (stat) =>
            stat.conversionCount ===
            Math.max(
              ...stats?.currencyStats.map((stat) => stat.conversionCount)
            )
        )?.currency || "N/A",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow border-l-4 border-black"
          >
            <div className="flex items-center gap-4">
              <div
                className={`rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}
              >
                <Icon
                  className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
