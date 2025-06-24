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
exports.getConversionChartData = exports.getDashboardStats = void 0;
const client_1 = require("@prisma/client");
const error_middleware_1 = require("../middleware/error.middleware");
const prisma = new client_1.PrismaClient();
exports.getDashboardStats = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw (0, error_middleware_1.createError)("User not authenticated", 401);
    }
    const userId = req.user.id;
    const totalConversions = yield prisma.conversion.count({
        where: { userId },
    });
    const uniquePairs = yield prisma.conversion.findMany({
        where: { userId },
        select: { fromCurrency: true, toCurrency: true },
        distinct: ["fromCurrency", "toCurrency"],
    });
    const fromCurrencyStats = yield prisma.conversion.groupBy({
        by: ["fromCurrency"],
        where: { userId },
        _sum: { fromAmount: true },
        _count: { id: true },
    });
    const toCurrencyStats = yield prisma.conversion.groupBy({
        by: ["toCurrency"],
        where: { userId },
        _sum: { toAmount: true },
        _count: { id: true },
    });
    const currencyMap = new Map();
    fromCurrencyStats.forEach((stat) => {
        const currency = stat.fromCurrency;
        currencyMap.set(currency, {
            currency,
            totalConverted: stat._sum.fromAmount || 0,
            conversionCount: stat._count.id,
        });
    });
    toCurrencyStats.forEach((stat) => {
        const currency = stat.toCurrency;
        const existing = currencyMap.get(currency);
        if (existing) {
            existing.totalConverted += stat._sum.toAmount || 0;
            existing.conversionCount += stat._count.id;
        }
        else {
            currencyMap.set(currency, {
                currency,
                totalConverted: stat._sum.toAmount || 0,
                conversionCount: stat._count.id,
            });
        }
    });
    const currencyStats = Array.from(currencyMap.values()).sort((a, b) => b.totalConverted - a.totalConverted);
    const recentConversions = yield prisma.conversion.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
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
    const dashboardStats = {
        totalConversions,
        totalCurrencyPairs: uniquePairs.length,
        currencyStats,
        recentConversions,
    };
    res.status(200).json({
        status: "success",
        data: dashboardStats,
    });
}));
exports.getConversionChartData = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw (0, error_middleware_1.createError)("User not authenticated", 401);
    }
    const { period = "7d" } = req.query;
    const userId = req.user.id;
    let startDate;
    const endDate = new Date();
    switch (period) {
        case "24h":
            startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
            break;
        case "7d":
            startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            break;
        case "30d":
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            break;
        case "90d":
            startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            break;
        default:
            startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }
    const conversions = yield prisma.conversion.findMany({
        where: {
            userId,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: { createdAt: "asc" },
    });
    const groupedData = conversions.reduce((acc, conversion) => {
        const date = conversion.createdAt.toISOString().split("T")[0];
        if (!acc[date]) {
            acc[date] = {
                date,
                count: 0,
                totalAmount: 0,
            };
        }
        acc[date].count += 1;
        acc[date].totalAmount += conversion.fromAmount;
        return acc;
    }, {});
    const chartData = Object.values(groupedData);
    res.status(200).json({
        status: "success",
        data: { chartData },
    });
}));
