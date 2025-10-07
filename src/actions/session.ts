"use server";
import {
  getSessionById,
  createSession as _createSession,
  updateSession as _updateSession,
} from "@/schema/session";
import {
  joinSessionSchema,
  type JoinSessionFormState,
} from "@/validation/session";

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

export const joinSessionAction = async (
  _prevState: JoinSessionFormState,
  formData: FormData,
): Promise<JoinSessionFormState> => {
  try {
    const rawSessionId = formData.get("sessionId");

    const parsed = joinSessionSchema.safeParse({
      sessionId: typeof rawSessionId === "string" ? rawSessionId : "",
    });

    if (!parsed.success) {
      return {
        errors: {
          sessionId:
            parsed.error.formErrors.fieldErrors.sessionId?.[0] ??
            "Session ID is required",
        },
      };
    }

    const session = await getSessionById(Number(parsed.data.sessionId));

    if (!session) {
      return { errors: { sessionId: "Session not found" } };
    }

    return { success: { redirectTo: `/session/${session.id}` } };
  } catch (error) {
    console.error("Error in joinSessionAction:", error);

    return {
      errors: { form: "An unexpected error occurred. Please try again." },
    };
  }
};
