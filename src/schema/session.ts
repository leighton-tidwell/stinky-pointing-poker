import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export const sessions = pgTable("session", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  storyDescription: text("storyDescription").default(""),
  showVotes: boolean("showVotes").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const getSessionTable = async () => {
  const selectResult = await db.select().from(sessions);

  return selectResult;
};

export const getSessionById = async (id: number) => {
  const selectResult = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, id));

  return selectResult[0];
};

export const createSession = async () => {
  const insertResult = await db
    .insert(sessions)
    .values({
      name: "New Session",
    })
    .returning();

  return insertResult[0];
};

export const updateSession = async (id: number, data: any) => {
  const updateResult = await db
    .update(sessions)
    .set(data)
    .where(eq(sessions.id, id))
    .returning();

  return updateResult[0];
};
