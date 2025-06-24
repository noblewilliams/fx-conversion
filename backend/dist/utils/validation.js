"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCurrencyPair = exports.dateSchema = exports.paginationSchema = exports.positiveNumberSchema = exports.currencyCodeSchema = exports.nameSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z.string().email("Invalid email format");
exports.passwordSchema = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters");
exports.nameSchema = zod_1.z
    .string()
    .min(2, "Name must be at least 2 characters");
exports.currencyCodeSchema = zod_1.z
    .string()
    .length(3, "Currency code must be 3 characters")
    .regex(/^[A-Z]{3}$/, "Currency code must be uppercase letters");
exports.positiveNumberSchema = zod_1.z
    .number()
    .positive("Amount must be positive");
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        const parsed = val ? parseInt(val) : 1;
        return parsed > 0 ? parsed : 1;
    }),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        const parsed = val ? parseInt(val) : 10;
        return parsed > 0 && parsed <= 100 ? parsed : 10;
    }),
});
exports.dateSchema = zod_1.z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format",
});
const validateCurrencyPair = (from, to, supportedCurrencies) => {
    if (!supportedCurrencies.includes(from)) {
        throw new Error(`Unsupported from currency: ${from}`);
    }
    if (!supportedCurrencies.includes(to)) {
        throw new Error(`Unsupported to currency: ${to}`);
    }
    return true;
};
exports.validateCurrencyPair = validateCurrencyPair;
