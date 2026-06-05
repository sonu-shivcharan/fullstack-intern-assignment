import { timestamp } from "drizzle-orm/pg-core";

/**
 * creates fields with createdAt and updatedAt with defaultNow() value
 * udatedAt sets to new Date() value when default values is not provided
 */
export const timestamps = {
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
};
