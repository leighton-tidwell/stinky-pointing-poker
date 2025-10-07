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
  const sessionSlugError = state.errors?.sessionSlug;

  return (
    <form
      action={handleAction}
      className="flex w-full flex-col gap-4 sm:flex-row sm:items-end"
      aria-describedby={sessionSlugError ? "sessionSlug-error" : undefined}
    >
      <div className="w-full space-y-2">
        <label
          htmlFor="sessionSlug"
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          Enter Session Code
        </label>
        <Input
          name="sessionSlug"
          id="sessionSlug"
          placeholder="e.g. wobbly-otter"
          autoComplete="off"
          required
          aria-invalid={sessionSlugError ? true : undefined}
        />
        {sessionSlugError ? (
          <p
            id="sessionSlug-error"
            className="text-sm font-medium text-destructive"
          >
            {sessionSlugError}
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
