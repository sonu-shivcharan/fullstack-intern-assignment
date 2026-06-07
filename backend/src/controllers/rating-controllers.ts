import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { ratings, users, type NewRating } from "../db/schema";
import ApiError from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";

export const createRating = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { storeId } = req.params;
  const { rating, review } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const [didRatedAlready] = await db
    .select()
    .from(ratings)
    .where(
      and(eq(ratings.userId, userId), eq(ratings.storeId, Number(storeId))),
    );

  if (didRatedAlready) {
    throw new ApiError(400, `Users has already rated to storeId:${storeId}`);
  }

  const ratingData: NewRating = {
    userId,
    storeId: Number(storeId),
    ...(review !== undefined && { review: review.trim() }),
    rating,
  };

  const [newRating] = await db
    .insert(ratings)
    .values(ratingData)
    .returning({ id: ratings.id });

  if (!newRating) {
    throw new ApiError(500, "Falied to create new rating");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        { rating: newRating },
        "Rating created successfully",
        201,
      ),
    );
});

export const editRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;
  const { rating, review } = req.body;

  if (rating === undefined && !review?.trim()) {
    throw new ApiError(400, "Either rating or review is required");
  }
  const updatedRating = await db
    .update(ratings)
    .set({
      ...(rating !== undefined && { rating }),
      ...(review !== undefined && { review: review?.trim() }),
    })
    .where(eq(ratings.id, Number(ratingId)))
    .returning();

  if (updatedRating.length === 0) {
    throw new ApiError(404, "Rating not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        { rating: updatedRating[0] },
        "Rating updated successfully",
        200,
      ),
    );
});

export const getRatingsbyStoreId = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const query = req.validatedQuery as any;

  const page = query?.page || 1;
  const limit = query?.limit || 10;
  const offset = (page - 1) * limit;
  const order = query?.order || "asc";

  const orderByExpression =
    order === "desc" ? desc(ratings.createdAt) : asc(ratings.createdAt);

  const allRatings = await db
    .select({
      id: ratings.id,
      rating: ratings.rating,
      review: ratings.review,
      createdAt: ratings.createdAt,
      updatedAt: ratings.updatedAt,
      user: {
        id: users.id,
        name: users.name,
      },
    })
    .from(ratings)
    .innerJoin(users, eq(users.id, ratings.userId))
    .where(eq(ratings.storeId, Number(storeId)))
    .orderBy(orderByExpression)
    .limit(limit)
    .offset(offset);

  return res
    .status(200)
    .json(
      new ApiResponse({ ratings: allRatings }, "Stores fetched successfully"),
    );
});
