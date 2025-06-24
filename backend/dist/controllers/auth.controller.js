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
exports.getProfile = exports.login = exports.register = void 0;
const zod_1 = require("zod");
const auth_service_1 = require("../services/auth.service");
const error_middleware_1 = require("../middleware/error.middleware");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.register = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
        throw (0, error_middleware_1.createError)(`Validation error: ${validationResult.error.errors
            .map((e) => e.message)
            .join(", ")}`, 400);
    }
    const userData = validationResult.data;
    const result = yield auth_service_1.authService.register(userData);
    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: result,
    });
}));
exports.login = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
        throw (0, error_middleware_1.createError)(`Validation error: ${validationResult.error.errors
            .map((e) => e.message)
            .join(", ")}`, 400);
    }
    const credentials = validationResult.data;
    const result = yield auth_service_1.authService.login(credentials);
    res.status(200).json({
        status: "success",
        message: "Login successful",
        data: result,
    });
}));
exports.getProfile = (0, error_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw (0, error_middleware_1.createError)("User not authenticated", 401);
    }
    res.status(200).json({
        status: "success",
        data: { user: req.user },
    });
}));
