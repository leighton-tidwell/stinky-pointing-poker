import { z } from "zod";

export const joinSessionSchema = z.object({
  sessionSlug: z
    .string({ required_error: "Session code is required" })
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)+$/, {
      message: "Session code should look like 'zesty-otter'",
    }),
});

export type JoinSessionInput = z.infer<typeof joinSessionSchema>;

export type JoinSessionFormState = {
  errors?: { sessionSlug?: string; form?: string };
  success?: { redirectTo: string };
};
