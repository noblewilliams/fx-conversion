"use client";

import { LoadingSpinner } from "@/components/ui/loader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SelectInput } from "../ui/input";
import { useChart } from "@/hooks";

export function ConversionChart() {
  const { period, periods, chartData, isLoading, setPeriod } = useChart();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Conversion Trends
        </h3>
        <SelectInput
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          options={periods}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-gray-400">
            No data available for this period
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="date"
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
            />
            <YAxis className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
              }}
              labelStyle={{ color: "#374151" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#000"
              strokeWidth={2}
              dot={{ fill: "#000", r: 4 }}
              activeDot={{ r: 6, fill: "#2563eb" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
