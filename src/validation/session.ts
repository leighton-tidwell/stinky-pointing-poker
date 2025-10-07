import { z } from "zod";

export const joinSessionSchema = z.object({
  sessionId: z
    .string({ required_error: "Session ID is required" })
    .trim()
    .min(1, "Session ID is required"),
});

export type JoinSessionInput = z.infer<typeof joinSessionSchema>;

export type JoinSessionFormState = {
  errors?: { sessionId?: string; form?: string };
  success?: { redirectTo: string };
};
