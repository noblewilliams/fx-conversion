"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
exports.dashboardRoutes = router;
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// Dashboard routes
router.get("/stats", dashboard_controller_1.getDashboardStats);
router.get("/chart", dashboard_controller_1.getConversionChartData);
