"use client";

import { useActionState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

import { joinSessionAction } from "@/actions/session";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { type JoinSessionFormState } from "@/validation/session";

const initialState: JoinSessionFormState = { errors: {} };

export const JoinSessionForm = () => {
  const router = useRouter();
  const [state, formAction, isActionPending] = useActionState(
    joinSessionAction,
    initialState,
  );
  const [isTransitionPending, startTransition] = useTransition();

  // Handle client-side redirect when server action returns success
  useEffect(() => {
    if (state.success?.redirectTo) {
      router.push(state.success.redirectTo);
    }
  }, [state.success, router]);

  const handleAction = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  const pending = isActionPending || isTransitionPending;
  const sessionIdError = state.errors?.sessionId;

  return (
    <form
      action={handleAction}
      className="flex gap-2"
      aria-describedby={sessionIdError ? "sessionId-error" : undefined}
    >
      <div className="flex-grow space-y-2">
        <Input
          name="sessionId"
          id="sessionId"
          placeholder="Enter Session ID"
          autoComplete="off"
          required
          aria-invalid={sessionIdError ? true : undefined}
        />
        {sessionIdError ? (
          <p
            id="sessionId-error"
            className="text-sm font-medium text-destructive"
          >
            {sessionIdError}
          </p>
        ) : null}
        {state.errors?.form ? (
          <p className="text-sm font-medium text-destructive">
            {state.errors.form}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? <Spinner /> : "Join Session"}
      </Button>
    </form>
  );
};
