import { z } from "zod";

export const emailSchema = z.string().email("Invalid email format");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters");

export const currencyCodeSchema = z
  .string()
  .length(3, "Currency code must be 3 characters")
  .regex(/^[A-Z]{3}$/, "Currency code must be uppercase letters");

export const positiveNumberSchema = z
  .number()
  .positive("Amount must be positive");

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = val ? parseInt(val) : 1;
      return parsed > 0 ? parsed : 1;
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = val ? parseInt(val) : 10;
      return parsed > 0 && parsed <= 100 ? parsed : 10;
    }),
});

export const dateSchema = z
  .string()
  .optional()
  .refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  });

export const validateCurrencyPair = (
  from: string,
  to: string,
  supportedCurrencies: string[]
) => {
  if (!supportedCurrencies.includes(from)) {
    throw new Error(`Unsupported from currency: ${from}`);
  }
  if (!supportedCurrencies.includes(to)) {
    throw new Error(`Unsupported to currency: ${to}`);
  }
  return true;
};
