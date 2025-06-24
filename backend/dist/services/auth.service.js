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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const error_middleware_1 = require("../middleware/error.middleware");
const prisma = new client_1.PrismaClient();
class AuthService {
    constructor() {
        this.saltRounds = 12;
        this.jwtSecret = process.env.JWT_SECRET || "your-secret-key";
        this.jwtExpiration = process.env.JWT_EXPIRATION || "7d";
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield prisma.user.findUnique({
                where: { email: userData.email },
            });
            if (existingUser) {
                throw (0, error_middleware_1.createError)("User already exists with this email", 409);
            }
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, this.saltRounds);
            const user = yield prisma.user.create({
                data: {
                    email: userData.email,
                    password: hashedPassword,
                    name: userData.name,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            const token = this.generateToken(user.id);
            return { user, token };
        });
    }
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { email: credentials.email },
            });
            if (!user) {
                throw (0, error_middleware_1.createError)("Invalid email or password", 401);
            }
            const isValidPassword = yield bcryptjs_1.default.compare(credentials.password, user.password);
            if (!isValidPassword) {
                throw (0, error_middleware_1.createError)("Invalid email or password", 401);
            }
            const token = this.generateToken(user.id);
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return { user: userWithoutPassword, token };
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        });
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, this.jwtSecret, {
            expiresIn: this.jwtExpiration,
        });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.jwtSecret);
        }
        catch (error) {
            throw (0, error_middleware_1.createError)("Invalid token", 401);
        }
    }
}
exports.authService = new AuthService();
