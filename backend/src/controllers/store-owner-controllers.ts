import { avg, count, eq } from "drizzle-orm";
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
    .where(eq(ratings.storeId, userStore.id));

  return res.status(200).json(
    new ApiResponse(
      {
        users: allUsersByStore,
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
      totalRatings: count(),
    })
    .from(stores)
    .innerJoin(ratings, eq(ratings.storeId, stores.id))
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
