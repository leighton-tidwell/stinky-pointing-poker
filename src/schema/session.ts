import {
  boolean,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export const sessions = pgTable(
  "session",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    storyDescription: text("storyDescription").default(""),
    showVotes: boolean("showVotes").default(false),
    deckPreset: text("deckPreset").notNull().default("fibonacci"),
    includeQuestionMark: boolean("includeQuestionMark").notNull().default(true),
    includeCoffeeBreak: boolean("includeCoffeeBreak").notNull().default(false),
    autoReveal: boolean("autoReveal").notNull().default(false),
    customDeckValues: jsonb("customDeckValues").$type<string[] | null>().default(null),
    customDeckAverageEnabled: boolean("customDeckAverageEnabled")
      .notNull()
      .default(false),
    createdBy: text("createdBy"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("session_slug_idx").on(table.slug)],
);

export type SessionRecord = typeof sessions.$inferSelect;

export type CreateSessionData = {
  slug: string;
  name?: string;
  createdBy?: string;
  deckPreset?: string;
  includeQuestionMark?: boolean;
  includeCoffeeBreak?: boolean;
  autoReveal?: boolean;
  customDeckValues?: string[] | null;
  customDeckAverageEnabled?: boolean;
};

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

export const getSessionBySlug = async (slug: string) => {
  const selectResult = await db
    .select()
    .from(sessions)
    .where(eq(sessions.slug, slug));

  return selectResult[0];
};

export const createSession = async ({
  slug,
  name,
  createdBy,
  deckPreset,
  includeQuestionMark,
  includeCoffeeBreak,
  autoReveal,
  customDeckValues,
  customDeckAverageEnabled,
}: CreateSessionData) => {
  const insertResult = await db
    .insert(sessions)
    .values({
      slug,
      name: name?.trim() ? name.trim() : "",
      createdBy,
      deckPreset: deckPreset ?? "fibonacci",
      includeQuestionMark: includeQuestionMark ?? true,
      includeCoffeeBreak: includeCoffeeBreak ?? false,
      autoReveal: autoReveal ?? false,
      customDeckValues: customDeckValues ?? null,
      customDeckAverageEnabled: customDeckAverageEnabled ?? false,
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
