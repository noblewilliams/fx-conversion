import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { LoginRequest, RegisterRequest, User } from "../types";
import { createError } from "../middleware/error.middleware";

const prisma = new PrismaClient();

class AuthService {
  private readonly saltRounds = 12;
  private readonly jwtSecret = process.env.JWT_SECRET || "your-secret-key";
  private readonly jwtExpiration = process.env.JWT_EXPIRATION || "7d";

  async register(
    userData: RegisterRequest
  ): Promise<{ user: User; token: string }> {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw createError("User already exists with this email", 409);
    }

    const hashedPassword = await bcrypt.hash(
      userData.password,
      this.saltRounds
    );

    const user = await prisma.user.create({
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
  }

  async login(
    credentials: LoginRequest
  ): Promise<{ user: User; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw createError("Invalid email or password", 401);
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isValidPassword) {
      throw createError("Invalid email or password", 401);
    }

    const token = this.generateToken(user.id);

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getUserById(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: this.jwtExpiration,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): { userId: string } {
    try {
      return jwt.verify(token, this.jwtSecret) as { userId: string };
    } catch (error) {
      throw createError("Invalid token", 401);
    }
  }
}

export const authService = new AuthService();
