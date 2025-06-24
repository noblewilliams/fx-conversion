import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useAuth } from "./use-auth";
import { api, ConversionData, ConversionResult, Currency } from "@/utils";

export const useConversion = () => {
  const { token } = useAuth();

  const queryClient = useQueryClient();

  const [rotated, setRotated] = React.useState(false);
  const [result, setResult] = React.useState<ConversionResult | null>(null);
  const [formData, setFormData] = React.useState<ConversionData>({
    fromCurrency: "USD",
    toCurrency: "NGN",
    fromAmount: 100,
  });

  const { data: currencies = [] } = useQuery<Currency[]>({
    queryKey: ["currencies"],
    queryFn: async () => await api.conversion.getSupportedCurrencies(),
    enabled: !!token,
  });

  const conversionMutation = useMutation({
    mutationFn: async (data: ConversionData) =>
      await api.conversion.convert(data),
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["conversions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    conversionMutation.mutate(formData);
  };

  const swapCurrencies = () => {
    setFormData({
      ...formData,
      fromCurrency: formData.toCurrency,
      toCurrency: formData.fromCurrency,
    });
    setResult(null);
    setRotated((prev) => !prev);
  };

  const getFlag = (code: string) =>
    currencies?.find((c) => c.code === code)?.flag || "";

  return {
    result,
    rotated,
    formData,
    currencies,
    conversionMutation,
    getFlag,
    setResult,
    setFormData,
    handleSubmit,
    swapCurrencies,
  };
};
