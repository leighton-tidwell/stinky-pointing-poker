"use server";
import {
  getVotesBySessionId as _getVotesbySessionId,
  castVote as _castVote,
  clearVotesForSession as _clearVotesForSession,
} from "@/schema/vote";
import { broadcastVoteCast, broadcastVotesCleared } from "@/lib/broadcast";

export const getVotesBySessionId = async (sessionId: string) => {
  const votes = await _getVotesbySessionId(sessionId);

  return votes;
};

export const castVote = async (
  sessionId: string,
  voterName: string,
  value: string,
) => {
  const newVote = await _castVote(sessionId, voterName, value);

  // Broadcast the vote to all connected clients
  await broadcastVoteCast(Number(sessionId), newVote);

  return newVote;
};

export const clearVotesForSession = async (sessionId: string) => {
  const result = await _clearVotesForSession(sessionId);

  // Broadcast votes cleared to all connected clients
  await broadcastVotesCleared(Number(sessionId));

  return result;
};
