import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest, LoginRequest, RegisterRequest } from "../types";
import { authService } from "../services/auth.service";
import { asyncHandler, createError } from "../middleware/error.middleware";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const register = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw createError(
        `Validation error: ${validationResult.error.errors
          .map((e) => e.message)
          .join(", ")}`,
        400
      );
    }

    const userData: RegisterRequest = validationResult.data;
    const result = await authService.register(userData);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: result,
    });
  }
);

export const login = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw createError(
        `Validation error: ${validationResult.error.errors
          .map((e) => e.message)
          .join(", ")}`,
        400
      );
    }

    const credentials: LoginRequest = validationResult.data;
    const result = await authService.login(credentials);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: result,
    });
  }
);

export const getProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw createError("User not authenticated", 401);
    }

    res.status(200).json({
      status: "success",
      data: { user: req.user },
    });
  }
);
