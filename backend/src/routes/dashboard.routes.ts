import { Router } from "express";
import {
  getDashboardStats,
  getConversionChartData,
} from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard routes
router.get("/stats", getDashboardStats);
router.get("/chart", getConversionChartData);

export { router as dashboardRoutes };
