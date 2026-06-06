import { integer, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { timestamps } from "../helpers";

export const stores = pgTable("stores", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 60 }).notNull(),
  address: varchar({ length: 400 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  ownerId: integer("owner_id")
    .notNull()
    .unique()
    .references(() => users.id),

  ...timestamps,
});

type NewStore = typeof stores.$inferInsert;
type Store = typeof stores.$inferSelect;

export type { NewStore, Store };
