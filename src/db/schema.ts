import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Oppora backend schema.
 * The public prototype frontend persists user state in localStorage;
 * these tables back the server-side integration points (newsletter,
 * contact desk) and are the insertion point for the future
 * opportunities / applications API.
 */
export const subscribers = pgTable("subscribers", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  source: varchar("source", { length: 64 }).notNull().default("footer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  topic: varchar("topic", { length: 80 }).notNull().default("general"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
