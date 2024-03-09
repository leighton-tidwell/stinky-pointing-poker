"use server";
import {
  getSessionById,
  createSession as _createSession,
  updateSession as _updateSession,
} from "@/schema/session";

export const getSession = async (id: string) => {
  const session = await getSessionById(Number(id));

  return session;
};

export const createSession = async () => {
  const session = await _createSession();

  return session;
};

export const updateSession = async (id: string, data: any) => {
  const session = await _updateSession(Number(id), data);

  return session;
};
