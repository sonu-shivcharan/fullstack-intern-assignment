import { users, type NewUser, type UserRole } from "../db/schema/users";
import bcrypt from "bcrypt";
import ApiError from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { db } from "../db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import type { CookieOptions } from "express";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

async function generateAccessToken(userId: number, userRole: UserRole) {
  try {
    const token = jwt.sign(
      {
        id: userId,
        role: userRole,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "1h",
      },
    );
    return token;
  } catch (error) {
    throw new Error("Error while creating access token");
  }
}

export const signupNormalUser = asyncHandler(async (req, res) => {
  const data = req.body as NewUser;
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (existingUser) {
    throw new ApiError(400, "User with email already exists");
  }

  const rawPassword = data.password;

  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  const newUser: NewUser = {
    name: data.name,
    address: data.address,
    email: data.email,
    role: "USER",
    password: hashedPassword,
  };

  const [createdUser] = await db.insert(users).values(newUser).returning({
    id: users.id,
    email: users.email,
    address: users.address,
    role: users.role,
    createdAt: users.createdAt,
  });

  if (!createdUser) {
    throw new ApiError(500, "Falied to create new user");
  }

  return res
    .status(200)
    .json(new ApiResponse({ user: createdUser }, "User created", 201));
});

export const signin = asyncHandler(async (req, res) => {
  const data = req.body;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (!user) {
    throw new ApiError(404, "User with email not found");
  }

  const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Credentials");
  }
  const accessToken = await generateAccessToken(user.id, user.role);
  const { password, ...userWithoutPassword } = user;
  return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60, // 1 hour
    })
    .status(200)
    .json(new ApiResponse({ user: userWithoutPassword }, "Signin Success"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      address: users.address,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(user, "User fetched successfully"));
});

export const logout = asyncHandler(async (req, res) => {
  return res
    .clearCookie("accessToken", cookieOptions)
    .status(200)
    .json(new ApiResponse({}, "Logout success"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { oldPassword, newPassword } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect current password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, userId));

  return res
    .status(200)
    .json(new ApiResponse({}, "Password changed successfully"));
});
