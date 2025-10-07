"use server";
import {
  createSession as createSessionRecord,
  getSessionBySlug,
  updateSession as updateSessionRecord,
  type CreateSessionData,
  type SessionRecord,
} from "@/schema/session";
import {
  joinSessionSchema,
  type JoinSessionFormState,
} from "@/validation/session";
import { generateSessionSlug, generateSessionTitle } from "@/lib/session-slug";
import { broadcastSessionUpdate } from "@/lib/broadcast";

const ensureUniqueSlug = async () => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const slug = generateSessionSlug();
    const existing = await getSessionBySlug(slug);

    if (!existing) {
      return slug;
    }
  }

  throw new Error("Unable to generate unique session slug");
};

export type CreateSessionOptions = Omit<CreateSessionData, "slug">;

export const createSession = async (
  options: CreateSessionOptions = {},
) => {
  const slug = await ensureUniqueSlug();
  const providedName = options.name?.trim();

  const session = await createSessionRecord({
    slug,
    name: providedName && providedName.length > 0 ? providedName : generateSessionTitle(),
    createdBy: options.createdBy,
    deckPreset: options.deckPreset,
    includeQuestionMark: options.includeQuestionMark,
    includeCoffeeBreak: options.includeCoffeeBreak,
    autoReveal: options.autoReveal,
    customDeckValues: options.customDeckValues,
  });

  return session;
};

export const updateSession = async (id: string, data: Partial<SessionRecord>) => {
  const session = await updateSessionRecord(Number(id), data);

  if (session) {
    await broadcastSessionUpdate(session.slug, data);
  }

  return session;
};

export const joinSessionAction = async (
  _prevState: JoinSessionFormState,
  formData: FormData,
): Promise<JoinSessionFormState> => {
  try {
    const rawSessionSlug = formData.get("sessionSlug");

    const parsed = joinSessionSchema.safeParse({
      sessionSlug: typeof rawSessionSlug === "string" ? rawSessionSlug : "",
    });

    if (!parsed.success) {
      return {
        errors: {
          sessionSlug:
            parsed.error.formErrors.fieldErrors.sessionSlug?.[0] ??
            "Session code is required",
        },
      };
    }

    const session = await getSessionBySlug(parsed.data.sessionSlug);

    if (!session) {
      return { errors: { sessionSlug: "Session not found" } };
    }

    return { success: { redirectTo: `/session/${session.slug}` } };
  } catch (error) {
    console.error("Error in joinSessionAction:", error);

    return {
      errors: { form: "An unexpected error occurred. Please try again." },
    };
  }
};
