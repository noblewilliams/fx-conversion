import React from "react";
import { api } from "@/utils";
import { useAuth } from "./use-auth";
import { useQuery } from "@tanstack/react-query";

export const useHistory = () => {
  const { token } = useAuth();

  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    currency: "",
    startDate: "",
    endDate: "",
  });

  const { data: currencies = [] } = useQuery({
    queryKey: ["currencies"],
    queryFn: async () => await api.conversion.getSupportedCurrencies(),
    enabled: !!token,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["conversions", page, filters],
    queryFn: async () =>
      api.conversion.getConversionHistory({
        page,
        limit: 10,
        currency: filters.currency,
        startDate: filters.startDate,
        endDate: filters.endDate,
      }),
    enabled: !!token,
  });

  return {
    page,
    data,
    error,
    filters,
    currencies,
    isLoading,
    setPage,
    setFilters,
  };
};
