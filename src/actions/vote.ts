"use server";
import {
  getVotesBySessionSlug as fetchVotesBySession,
  castVote as writeVote,
  clearVotesForSession as purgeVotes,
} from "@/schema/vote";
import { broadcastVoteCast, broadcastVotesCleared } from "@/lib/broadcast";

export const getVotesBySessionSlug = async (sessionSlug: string) => {
  const votes = await fetchVotesBySession(sessionSlug);

  return votes;
};

export const castVote = async (
  sessionSlug: string,
  voterName: string,
  value: string,
) => {
  const newVote = await writeVote(sessionSlug, voterName, value);

  await broadcastVoteCast(sessionSlug, newVote);

  return newVote;
};

export const clearVotesForSession = async (sessionSlug: string) => {
  const result = await purgeVotes(sessionSlug);

  await broadcastVotesCleared(sessionSlug);

  return result;
};
