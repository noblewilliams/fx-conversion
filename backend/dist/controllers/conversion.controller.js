"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedCurrencies = exports.getConversionById = exports.getConversions = exports.createConversion = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const exchange_rate_service_1 = require("../services/exchange-rate.service");
const error_middleware_1 = require("../middleware/error.middleware");
const currency_utils_1 = require("../utils/currency.utils");
const prisma = new client_1.PrismaClient();
const conversionSchema = zod_1.z.object({
    fromCurrency: zod_1.z
        .string()
        .length(3, "Currency code must be 3 characters")
        .toUpperCase(),
    toCurrency: zod_1.z
        .string()
        .length(3, "Currency code must be 3 characters")
        .toUpperCase(),
    fromAmount: zod_1.z.number().positive("Amount must be positive"),
});
const conversionQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 1)),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 10)),
    currency: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
exports.createConversion = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw (0, error_middleware_1.createError)("User not authenticated", 401);
    }
    const validationResult = conversionSchema.safeParse(req.body);
    if (!validationResult.success) {
        throw (0, error_middleware_1.createError)(`Validation error: ${validationResult.error.errors
            .map((e) => e.message)
            .join(", ")}`, 400);
    }
    const { fromCurrency, toCurrency, fromAmount } = validationResult.data;
    const supportedCurrencies = yield exchange_rate_service_1.exchangeRateService.getSupportedCurrencies();
    if (!supportedCurrencies.includes(fromCurrency) ||
        !supportedCurrencies.includes(toCurrency)) {
        throw (0, error_middleware_1.createError)("Unsupported currency", 400);
    }
    const exchangeRate = yield exchange_rate_service_1.exchangeRateService.getExchangeRate(fromCurrency, toCurrency);
    const toAmount = exchange_rate_service_1.exchangeRateService.convertAmount(fromAmount, exchangeRate);
    const conversion = yield prisma.conversion.create({
        data: {
            userId: req.user.id,
            fromCurrency,
            toCurrency,
            fromAmount,
            toAmount,
            exchangeRate,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });
    res.status(201).json({
        status: "success",
        message: "Conversion created successfully",
        data: { conversion },
    });
}));
exports.getConversions = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw (0, error_middleware_1.createError)("User not authenticated", 401);
    }
    const queryValidation = conversionQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
        throw (0, error_middleware_1.createError)("Invalid query parameters", 400);
    }
    const { page, limit, currency, startDate, endDate } = queryValidation.data;
    const skip = (page - 1) * limit;
    // Build where clause
    const where = { userId: req.user.id };
    if (currency) {
        where.OR = [{ fromCurrency: currency }, { toCurrency: currency }];
    }
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
            where.createdAt.gte = new Date(startDate);
        }
        if (endDate) {
            where.createdAt.lte = new Date(endDate);
        }
    }
    const [conversions, total] = yield Promise.all([
        prisma.conversion.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        }),
        prisma.conversion.count({ where }),
    ]);
    res.status(200).json({
        status: "success",
        data: {
            conversions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
            },
        },
    });
}));
exports.getConversionById = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw (0, error_middleware_1.createError)("User not authenticated", 401);
    }
    const { id } = req.params;
    const conversion = yield prisma.conversion.findFirst({
        where: {
            id,
            userId: req.user.id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });
    if (!conversion) {
        throw (0, error_middleware_1.createError)("Conversion not found", 404);
    }
    res.status(200).json({
        status: "success",
        data: { conversion },
    });
}));
exports.getSupportedCurrencies = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codes = yield exchange_rate_service_1.exchangeRateService.getSupportedCurrencies();
    const currencies = (0, currency_utils_1.getCurrenciesWithFlags)(codes);
    res.status(200).json({
        status: "success",
        data: { currencies },
    });
}));
