import { avg, count, eq, asc, desc } from "drizzle-orm";
import { db } from "../db";
import { ratings, stores, users } from "../db/schema";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import ApiError from "../utils/api-error";

export const getUserByStoreId = asyncHandler(async (req, res) => {
  const ownerId = req.user?.id as number;
  const [userStore] = await db
    .select({
      id: stores.id,
    })
    .from(stores)
    .where(eq(stores.ownerId, ownerId));

  if (!userStore) {
    throw new ApiError(
      200,
      "You are not associated with any store now, try again later",
    );
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const order = req.query.order === "asc" ? "asc" : "desc";

  const orderByExpression = order === "asc" ? asc(ratings.createdAt) : desc(ratings.createdAt);

  const allUsersByStore = await db
    .select({
      id: users.id,
      name: users.name,
      address: users.address,
      rating: {
        id: ratings.id,
        rating: ratings.rating,
        review: ratings.review,
        createdAt: ratings.createdAt,
        updatedAt: ratings.updatedAt,
      },
    })
    .from(ratings)
    .innerJoin(users, eq(users.id, ratings.userId))
    .where(eq(ratings.storeId, userStore.id))
    .orderBy(orderByExpression)
    .limit(limit + 1)
    .offset(offset);

  const hasMore = allUsersByStore.length > limit;
  const dataToReturn = hasMore ? allUsersByStore.slice(0, limit) : allUsersByStore;
  const nextPage = hasMore ? page + 1 : null;

  return res.status(200).json(
    new ApiResponse(
      {
        users: dataToReturn,
        nextPage,
        hasMore,
      },
      "Users fetched successfully",
    ),
  );
});

export const storeOwnerDashBoard = asyncHandler(async (req, res) => {
  const ownerId = req.user?.id as number;

  const [store] = await db
    .select({
      id: stores.id,
      name: stores.name,
      email: stores.email,
      address: stores.address,
      averageRating: avg(ratings.rating),
      totalRatings: count(ratings.id),
    })
    .from(stores)
    .leftJoin(ratings, eq(ratings.storeId, stores.id))
    .where(eq(stores.ownerId, ownerId))
    .groupBy(stores.id);

  if (!store) {
    throw new ApiError(
      400,
      "You are not associated with any store now, try again later",
    );
  }

  return res.status(200).json(
    new ApiResponse(
      {
        dashboard: {
          store,
        },
      },
      "owner Dashboard fetched successfully",
    ),
  );
});
