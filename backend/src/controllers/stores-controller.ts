import { and, asc, avg, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../db";
import { ratings, stores } from "../db/schema";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import type { GetStoresQuerySchema } from "../validations/store-validations";

const getStoreById = asyncHandler(async (req, res) => {
  let storeId = req.params.storeId;

  const [store] = await db
    .select({
      id: stores.id,
      name: stores.name,
      email: stores.email,
      address: stores.address,
      avgRating: avg(ratings.rating),
      createdAt: stores.createdAt,
    })
    .from(stores)
    .leftJoin(ratings, eq(stores.id, ratings.storeId))
    .where(eq(stores.id, Number(storeId)))
    .groupBy(stores.id);

  return res.status(200).json(new ApiResponse({ store }));
});

const getAllStores = asyncHandler(async (req, res) => {
  const query = req.validatedQuery as GetStoresQuerySchema;

  const search = query?.search;
  const page = query?.page || 1;
  const limit = query?.limit || 10;
  const offset = (page - 1) * limit;
  const sortBy = query?.sortBy || "createdAt";
  const order = query?.order || "asc";

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(stores.name, `%${search}%`),
        ilike(stores.email, `%${search}%`),
        ilike(stores.address, `%${search}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const sortByColumn = stores[sortBy];
  const orderByExpression =
    order === "desc" ? desc(sortByColumn) : asc(sortByColumn);

  const allStores = await db
    .select({
      id: stores.id,
      name: stores.name,
      email: stores.email,
      address: stores.address,
      createdAt: stores.createdAt,
      avgRating: avg(ratings.rating),
      totalRatings: count(ratings.id),
    })
    .from(stores)
    .leftJoin(ratings, eq(ratings.storeId, stores.id))
    .where(whereClause)
    .groupBy(stores.id)
    .orderBy(orderByExpression)
    .limit(limit)
    .offset(offset);

  return res
    .status(200)
    .json(
      new ApiResponse({ stores: allStores }, "Stores fetched successfully"),
    );
});

export { getStoreById, getAllStores };
