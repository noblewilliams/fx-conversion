import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest, DashboardStats, CurrencyStats } from "../types";
import { asyncHandler, createError } from "../middleware/error.middleware";

const prisma = new PrismaClient();

export const getDashboardStats = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw createError("User not authenticated", 401);
    }

    const userId = req.user.id;

    const totalConversions = await prisma.conversion.count({
      where: { userId },
    });

    const uniquePairs = await prisma.conversion.findMany({
      where: { userId },
      select: { fromCurrency: true, toCurrency: true },
      distinct: ["fromCurrency", "toCurrency"],
    });

    const fromCurrencyStats = await prisma.conversion.groupBy({
      by: ["fromCurrency"],
      where: { userId },
      _sum: { fromAmount: true },
      _count: { id: true },
    });

    const toCurrencyStats = await prisma.conversion.groupBy({
      by: ["toCurrency"],
      where: { userId },
      _sum: { toAmount: true },
      _count: { id: true },
    });

    const currencyMap = new Map<string, CurrencyStats>();

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
      } else {
        currencyMap.set(currency, {
          currency,
          totalConverted: stat._sum.toAmount || 0,
          conversionCount: stat._count.id,
        });
      }
    });

    const currencyStats = Array.from(currencyMap.values()).sort(
      (a, b) => b.totalConverted - a.totalConverted
    );

    const recentConversions = await prisma.conversion.findMany({
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

    const dashboardStats: DashboardStats = {
      totalConversions,
      totalCurrencyPairs: uniquePairs.length,
      currencyStats,
      recentConversions,
    };

    res.status(200).json({
      status: "success",
      data: dashboardStats,
    });
  }
);

export const getConversionChartData = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw createError("User not authenticated", 401);
    }

    const { period = "7d" } = req.query;
    const userId = req.user.id;

    let startDate: Date;
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

    const conversions = await prisma.conversion.findMany({
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
    }, {} as Record<string, { date: string; count: number; totalAmount: number }>);

    const chartData = Object.values(groupedData);

    res.status(200).json({
      status: "success",
      data: { chartData },
    });
  }
);
