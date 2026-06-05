import { integer, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers";

export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "USER",
  "STORE_OWNER",
]);
export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 60 }).notNull(),
  address: varchar({ length: 400 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: userRoleEnum().default("USER").notNull(),
  password: text().notNull(),

  ...timestamps,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
