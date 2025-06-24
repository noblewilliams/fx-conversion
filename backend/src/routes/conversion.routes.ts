import { Router } from "express";
import {
  createConversion,
  getConversions,
  getConversionById,
  getSupportedCurrencies,
} from "../controllers/conversion.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", createConversion);
router.get("/", getConversions);
router.get("/currencies", getSupportedCurrencies);
router.get("/:id", getConversionById);

export { router as conversionRoutes };
