import { eq, and, ilike, or, asc, desc, avg } from "drizzle-orm";
import { db } from "../db";
import {
  ratings,
  stores,
  users,
  type NewStore,
  type NewUser,
} from "../db/schema";
import { asyncHandler } from "../utils/async-handler";
import ApiError from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import bcrypt from "bcrypt";
import type { GetUsersQuerySchema } from "../validations/admin-validations";

const createUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    address,
    password: rawPassword,
    role,
  }: NewUser = req.body;

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    throw new ApiError(400, "User with email already exists");
  }

  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  const newUserData: NewUser = {
    name,
    address,
    email,
    role,
    password: hashedPassword,
  };

  const [createdUser] = await db.insert(users).values(newUserData).returning({
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

const getAllUsers = asyncHandler(async (req, res) => {
  const query = req.validatedQuery as GetUsersQuerySchema;

  const role = query?.role;
  const search = query?.search;
  const page = query?.page || 1;
  const limit = query?.limit || 10;
  const offset = (page - 1) * limit;
  const sortBy = query?.sortBy || "createdAt";
  const order = query?.order || "asc";

  const conditions = [];
  if (role) {
    conditions.push(eq(users.role, role));
  }
  if (search) {
    conditions.push(
      or(
        ilike(users.name, `%${search}%`),
        ilike(users.email, `%${search}%`),
        ilike(users.address, `%${search}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const sortByColumn = users[sortBy];
  const orderByExpression =
    order === "desc" ? desc(sortByColumn) : asc(sortByColumn);

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      address: users.address,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereClause)
    .orderBy(orderByExpression)
    .limit(limit)
    .offset(offset);

  return res
    .status(200)
    .json(new ApiResponse(allUsers, "Users fetched successfully"));
});

const createStore = asyncHandler(async (req, res) => {
  const { name, email, address, ownerId }: NewStore = req.body;

  const [existingOwner] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingOwner?.role !== "STORE_OWNER") {
    throw new ApiError(400, "User role should STORE_OWNER");
  }

  if (!existingOwner) {
    throw new ApiError(404, "User with id does not exists");
  }
  const [existingOwnerStore] = await db
    .select()
    .from(stores)
    .where(eq(stores.ownerId, ownerId))
    .limit(1);

  if (!existingOwnerStore) {
    throw new ApiError(400, "Owner is already associated with other store.");
  }

  const newStoreData: NewStore = {
    name,
    email,
    address,
    ownerId,
  };

  const [createdStore] = await db
    .insert(stores)
    .values(newStoreData)
    .returning();

  if (!createdStore) {
    throw new ApiError(500, "Failed to create new store");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        { store: createdStore },
        "Store created successfully",
        201,
      ),
    );
});

const adminDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    db.$count(users),
    db.$count(stores),
    db.$count(ratings),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        { totalUsers, totalRatings, totalStores },
        "Admin Dashboard fetched successfully",
      ),
    );
});

export { createUser, createStore, getAllUsers, adminDashboard };
