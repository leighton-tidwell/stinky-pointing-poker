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
      className="flex w-full flex-col gap-4 sm:flex-row sm:items-end"
      aria-describedby={sessionIdError ? "sessionId-error" : undefined}
    >
      <div className="w-full space-y-2">
        <label
          htmlFor="sessionId"
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          Enter Session ID
        </label>
        <Input
          name="sessionId"
          id="sessionId"
          placeholder="e.g. 8472"
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
      <Button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto"
      >
        {pending ? <Spinner /> : "Beam Me In"}
      </Button>
    </form>
  );
};
