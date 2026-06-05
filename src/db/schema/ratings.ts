import { integer, pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { stores } from "./stores";
import { timestamps } from "../helpers";

export const ratings = pgTable(
  "ratings",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    rating: integer().notNull(),
    review: varchar({ length: 255 }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id),

    ...timestamps,
  },
  (rating) => [
    unique("user_store_rating_unique").on(rating.storeId, rating.userId),
  ],
);
