import { Response } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest, ConversionRequest } from "../types";
import { exchangeRateService } from "../services/exchange-rate.service";
import { asyncHandler, createError } from "../middleware/error.middleware";
import { getCurrenciesWithFlags } from "../utils/currency.utils";

const prisma = new PrismaClient();

const conversionSchema = z.object({
  fromCurrency: z
    .string()
    .length(3, "Currency code must be 3 characters")
    .toUpperCase(),
  toCurrency: z
    .string()
    .length(3, "Currency code must be 3 characters")
    .toUpperCase(),
  fromAmount: z.number().positive("Amount must be positive"),
});

const conversionQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  currency: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const createConversion = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw createError("User not authenticated", 401);
    }

    const validationResult = conversionSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw createError(
        `Validation error: ${validationResult.error.errors
          .map((e) => e.message)
          .join(", ")}`,
        400
      );
    }

    const { fromCurrency, toCurrency, fromAmount }: ConversionRequest =
      validationResult.data;

    const supportedCurrencies =
      await exchangeRateService.getSupportedCurrencies();

    if (
      !supportedCurrencies.includes(fromCurrency) ||
      !supportedCurrencies.includes(toCurrency)
    ) {
      throw createError("Unsupported currency", 400);
    }

    const exchangeRate = await exchangeRateService.getExchangeRate(
      fromCurrency,
      toCurrency
    );
    const toAmount = exchangeRateService.convertAmount(
      fromAmount,
      exchangeRate
    );

    const conversion = await prisma.conversion.create({
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
  }
);

export const getConversions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw createError("User not authenticated", 401);
    }

    const queryValidation = conversionQuerySchema.safeParse(req.query);

    if (!queryValidation.success) {
      throw createError("Invalid query parameters", 400);
    }

    const { page, limit, currency, startDate, endDate } = queryValidation.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId: req.user.id };

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

    const [conversions, total] = await Promise.all([
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
  }
);

export const getConversionById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw createError("User not authenticated", 401);
    }

    const { id } = req.params;

    const conversion = await prisma.conversion.findFirst({
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
      throw createError("Conversion not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: { conversion },
    });
  }
);

export const getSupportedCurrencies = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const codes = await exchangeRateService.getSupportedCurrencies();
    const currencies = getCurrenciesWithFlags(codes);

    res.status(200).json({
      status: "success",
      data: { currencies },
    });
  }
);
