import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";

export const votes = pgTable("vote", {
  id: serial("id").primaryKey(),
  voterName: text("voterName").notNull(),
  value: text("vote").notNull(),
  sessionSlug: text("sessionSlug").notNull(),
});

export type Vote = typeof votes.$inferSelect;

export const getVotesBySessionSlug = async (sessionSlug: string) => {
  const selectResult = await db
    .select()
    .from(votes)
    .where(eq(votes.sessionSlug, sessionSlug));

  return selectResult;
};

export const castVote = async (
  sessionSlug: string,
  voterName: string,
  value: string,
) => {
  // First lets see if there is a vote with the voters name for the current session
  const existingVote = await db
    .select()
    .from(votes)
    .where(
      and(eq(votes.voterName, voterName), eq(votes.sessionSlug, sessionSlug)),
    );

  // If there is, we will update the vote
  if (existingVote.length > 0) {
    const updateResult = await db
      .update(votes)
      .set({ value })
      .where(
        and(eq(votes.voterName, voterName), eq(votes.sessionSlug, sessionSlug)),
      )
      .returning();

    return updateResult[0];
  }

  const insertResult = await db
    .insert(votes)
    .values({
      sessionSlug,
      voterName,
      value,
    })
    .returning();

  return insertResult[0];
};

export const clearVotesForSession = async (sessionSlug: string) => {
  await db.delete(votes).where(eq(votes.sessionSlug, sessionSlug));

  return null;
};
