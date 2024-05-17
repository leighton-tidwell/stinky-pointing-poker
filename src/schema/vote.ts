import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";

export const votes = pgTable("vote", {
  id: serial("id").primaryKey(),
  voterName: text("voterName").notNull(),
  value: text("vote").notNull(),
  sessionId: text("sessionId").notNull(),
});

export type Vote = typeof votes.$inferSelect;

export const getVotesBySessionId = async (sessionId: string) => {
  const selectResult = await db
    .select()
    .from(votes)
    .where(eq(votes.sessionId, sessionId));

  return selectResult;
};

export const castVote = async (
  sessionId: string,
  voterName: string,
  value: string,
) => {
  // First lets see if there is a vote with the voters name for the current session
  const existingVote = await db
    .select()
    .from(votes)
    .where(and(eq(votes.voterName, voterName), eq(votes.sessionId, sessionId)));

  // If there is, we will update the vote
  if (existingVote.length > 0) {
    const updateResult = await db
      .update(votes)
      .set({ value })
      .where(
        and(eq(votes.voterName, voterName), eq(votes.sessionId, sessionId)),
      )
      .returning();

    return updateResult[0];
  }

  const insertResult = await db
    .insert(votes)
    .values({
      sessionId,
      voterName,
      value,
    })
    .returning();

  return insertResult[0];
};

export const clearVotesForSession = async (sessionId: string) => {
  await db.delete(votes).where(eq(votes.sessionId, sessionId));

  return null;
};
