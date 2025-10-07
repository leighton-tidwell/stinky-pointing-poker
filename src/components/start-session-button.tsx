"use client";

import { FormEvent, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Settings2, PlusCircle, Check, Circle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createSession } from "@/actions/session";
import { Spinner } from "@/components/spinner";
import {
  deckOptionsCatalog,
  resolveDeckValues,
  type DeckPreset,
  isNumericVoteValue,
} from "@/lib/decks";

const getOrCreateOperatorId = () => {
  try {
    const existing = localStorage.getItem("operatorId");
    if (existing) return existing;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `Operator-${randomNum}`;
    localStorage.setItem("operatorId", id);
    return id;
  } catch (error) {
    console.warn("Unable to access localStorage", error);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `Operator-${randomNum}`;
  }
};

export const StartSessionButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [deckPreset, setDeckPreset] = useState<DeckPreset>("fibonacci");
  const [includeQuestionMark, setIncludeQuestionMark] = useState(true);
  const [includeCoffeeBreak, setIncludeCoffeeBreak] = useState(false);
  const [autoReveal, setAutoReveal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customDeckValues, setCustomDeckValues] = useState<string[]>([]);
  const [customValueInput, setCustomValueInput] = useState("");
  const [customDeckError, setCustomDeckError] = useState<string | null>(null);
  const [customDeckAverageEnabled, setCustomDeckAverageEnabled] = useState(false);

  const deckPreview = useMemo(() => {
    const values = resolveDeckValues(deckPreset, {
      includeQuestionMark,
      includeCoffeeBreak,
    }, deckPreset === "custom" ? customDeckValues : undefined);
    return values.slice(0, 6).join(" · ");
  }, [deckPreset, includeQuestionMark, includeCoffeeBreak, customDeckValues]);

  const customAverageEligible = useMemo(() => {
    if (deckPreset !== "custom") return false;
    if (customDeckValues.length === 0) return false;
    return customDeckValues.every((value) => isNumericVoteValue(value));
  }, [deckPreset, customDeckValues]);

  useEffect(() => {
    if (!customAverageEligible && customDeckAverageEnabled) {
      setCustomDeckAverageEnabled(false);
    }
  }, [customAverageEligible, customDeckAverageEnabled]);

  const handleCustomValueAdd = (rawValue?: string) => {
    const candidate = (rawValue ?? customValueInput).trim();
    if (!candidate) return;

    if (!/^[a-zA-Z0-9.+-]+$/.test(candidate)) {
      setCustomDeckError("Use alphanumeric characters, plus optional . + - symbols.");
      return;
    }

    const normalized = candidate.toUpperCase();

    if (customDeckValues.includes(normalized)) {
      setCustomDeckError("That value is already in the deck.");
      return;
    }

    setCustomDeckValues((prev) => [...prev, normalized]);
    setCustomValueInput("");
    setCustomDeckError(null);
  };

  const handleCustomValueKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      handleCustomValueAdd();
    }
  };

  const handleRemoveCustomValue = (value: string) => {
    setCustomDeckValues((prev) => prev.filter((item) => item !== value));
  };

  const handleLaunch = async () => {
    setLoading(true);
    setError(null);
    try {
      if (deckPreset === "custom" && customDeckValues.length === 0) {
        setError("Add at least one custom voting value before launching.");
        setLoading(false);
        return;
      }

      const operatorId = getOrCreateOperatorId();
      const session = await createSession({
        createdBy: operatorId,
        name: sessionName.trim() ? sessionName.trim() : undefined,
        deckPreset,
        includeQuestionMark,
        includeCoffeeBreak,
        autoReveal,
        customDeckValues: deckPreset === "custom" ? customDeckValues : undefined,
        customDeckAverageEnabled:
          deckPreset === "custom" && customAverageEligible
            ? customDeckAverageEnabled
            : undefined,
      });
      setOpen(false);
      router.push(`/session/${session.slug}`);
    } catch (err) {
      console.error(err);
      setError("Failed to launch the session. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loading) {
      void handleLaunch();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => !loading && setOpen(next)}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="m-auto gap-2 border-primary/30 text-primary hover:border-primary hover:text-primary-foreground"
        >
          <span className="flex items-center gap-2">
            <PlusCircle className="size-4" />
            Launch New Session
            <Settings2 className="size-4" />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-screen w-screen max-w-none rounded-none border-none p-0 lg:h-auto lg:w-auto lg:max-w-2xl lg:rounded-2xl lg:border">
        <form
          onSubmit={handleSubmit}
          className="flex h-full flex-col overflow-hidden lg:max-h-[80vh]"
        >
          <DialogHeader className="sticky top-0 z-10 border-b border-primary/15 bg-card/95 px-6 py-4 backdrop-blur">
            <DialogTitle>Tune your session</DialogTitle>
            <DialogDescription>
              Dial in the deck, safety valves, and reveal behaviour before your
              crew beams in.
            </DialogDescription>
          </DialogHeader>

          <div className="scrollbar-thin scrollbar-thumb-primary/30 flex-1 overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-6 pb-20 sm:pb-6">
            <div className="space-y-2">
              <Label htmlFor="session-name">Session name</Label>
              <Input
                id="session-name"
                value={sessionName}
                onChange={(event) => setSessionName(event.target.value)}
                placeholder="Optional: Backlog triage, Retro spikes, ..."
              />
              <p className="text-sm text-muted-foreground">
                Shown in the live console header. Leave blank for the default
                call sign.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Deck preset
                </span>
                <p className="text-sm text-muted-foreground">
                  Choose the cadence your squad estimates in.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {deckOptionsCatalog.map((deck) => (
                  <button
                    key={deck.value}
                    type="button"
                    onClick={() => {
                      setDeckPreset(deck.value);
                      if (deck.value !== "custom") {
                        setCustomDeckError(null);
                        setCustomDeckAverageEnabled(false);
                      }
                    }}
                    className={cn(
                      "flex flex-col rounded-xl border px-4 py-3 text-left transition",
                      deckPreset === deck.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-primary/20 bg-secondary/30 text-foreground/80 hover:border-primary/40",
                    )}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em]">
                      {deck.value === deckPreset ? (
                        <Check className="size-4 text-primary" />
                      ) : (
                        <Circle className="size-4 text-primary/50" />
                      )}
                      {deck.label}
                    </span>
                    <span className="mt-2 text-xs text-muted-foreground">
                      {deck.description}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Preview: {deckPreview}
              </p>
            </div>

            {deckPreset === "custom" ? (
              <div className="space-y-3 rounded-xl border border-primary/20 bg-secondary/20 p-4">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Custom voting values
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Tap enter after each value. Use alphanumeric tokens like
                    <span className="font-semibold text-primary"> 1 </span>,
                    <span className="font-semibold text-primary"> 2 </span>, or
                    <span className="font-semibold text-primary"> XXL </span> to
                    match your team&apos;s lingo.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={customValueInput}
                    onChange={(event) => {
                      setCustomValueInput(event.target.value);
                      setCustomDeckError(null);
                    }}
                    onKeyDown={handleCustomValueKeyDown}
                    placeholder="Press enter to add, e.g. 0.5"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCustomValueAdd()}
                    disabled={!customValueInput.trim()}
                    className="gap-2 border-primary/30 text-primary"
                  >
                    Add
                  </Button>
                </div>
                {customDeckError ? (
                  <p className="text-xs font-medium text-destructive">
                    {customDeckError}
                  </p>
                ) : null}
                {customDeckValues.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {customDeckValues.map((value) => (
                      <span
                        key={value}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary"
                      >
                        {value}
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomValue(value)}
                          className="text-primary/70 transition hover:text-primary"
                          aria-label={`Remove ${value}`}
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No custom values yet — add at least one to launch.
                  </p>
                )}
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Custom average
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant={customDeckAverageEnabled ? "default" : "outline"}
                      disabled={!customAverageEligible}
                      onClick={() =>
                        customAverageEligible &&
                        setCustomDeckAverageEnabled((prev) => !prev)
                      }
                      className={cn(
                        "gap-2 border-primary/30",
                        customDeckAverageEnabled
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/30 text-primary",
                        !customAverageEligible && "opacity-60",
                      )}
                    >
              {customDeckAverageEnabled ? "Average enabled" : "Enable average"}
                    </Button>
                    {!customAverageEligible ? (
                      <span className="text-xs text-muted-foreground">
                        Add numeric-only values (e.g. 1, 2, 3) to unlock averages.
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        We&apos;ll show a consensus average once votes reveal.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Extra cards
              </span>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={includeQuestionMark ? "default" : "outline"}
                  className={cn(
                    "gap-2 border-primary/30",
                    includeQuestionMark
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/30 text-primary",
                  )}
                  onClick={() => setIncludeQuestionMark((prev) => !prev)}
                >
                  {includeQuestionMark ? "Keep ?" : "Add ?"}
                </Button>
                <Button
                  type="button"
                  variant={includeCoffeeBreak ? "default" : "outline"}
                  className={cn(
                    "gap-2 border-primary/30",
                    includeCoffeeBreak
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/30 text-primary",
                  )}
                  onClick={() => setIncludeCoffeeBreak((prev) => !prev)}
                >
                  {includeCoffeeBreak ? "Keep ☕" : "Add ☕"}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Reveal logic
              </span>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={autoReveal ? "default" : "outline"}
                  className={cn(
                    "gap-2 border-primary/30",
                    autoReveal
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/30 text-primary",
                  )}
                  onClick={() => setAutoReveal((prev) => !prev)}
                >
                  {autoReveal ? "Auto reveal enabled" : "Auto reveal disabled"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                When every named operator has voted, votes flip automatically.
              </p>
            </div>
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-primary/15 bg-card/95 px-6 py-4 backdrop-blur">
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              {error ? (
                <p className="text-sm font-medium text-destructive sm:mr-auto">
                  {error}
                </p>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? <Spinner /> : "Launch Session"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
      </Dialog>
      {loading ? (
      <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#07110c]/70 backdrop-blur-xl">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-20 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-primary/20 blur-[180px]" />
          <div className="absolute right-10 bottom-10 h-[220px] w-[220px] rounded-full bg-accent/20 blur-[140px]" />
        </div>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/25 bg-secondary/30 px-10 py-12 shadow-[0_25px_60px_rgba(6,20,11,0.55)]">
          <Spinner />
          <div className="space-y-1 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
              Calibrating session
            </p>
            <p className="text-base text-primary">
              We&apos;re routing you to the new console…
            </p>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
};
