"use server";
import {
  getVotesBySessionId as _getVotesbySessionId,
  castVote as _castVote,
  clearVotesForSession as _clearVotesForSession,
} from "@/schema/vote";

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

  return newVote;
};

export const clearVotesForSession = async (sessionId: string) => {
  const result = await _clearVotesForSession(sessionId);

  return result;
};
