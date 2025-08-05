import { pgTable, integer, char, timestamp } from "drizzle-orm/pg-core";

export const scoreTable = pgTable('score', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: char({ length: 3 }).notNull(),
    score: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
});
