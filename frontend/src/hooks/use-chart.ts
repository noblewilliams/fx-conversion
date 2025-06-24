import React from "react";
import { useAuth } from "./use-auth";
import { api } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export const useChart = () => {
  const { token } = useAuth();

  const [period, setPeriod] = React.useState("7d");

  const { data, isLoading } = useQuery({
    queryKey: ["conversion-chart", period],
    queryFn: async () => api.conversion.getChartData(period),
    enabled: !!token,
  });

  const chartData = data?.chartData || [];

  const periods = [
    { value: "24h", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
  ];

  return {
    period,
    periods,
    chartData,
    isLoading,
    setPeriod,
  };
};
