"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings2, PlusCircle, Check, Circle } from "lucide-react";
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

  const deckPreview = useMemo(() => {
    const values = resolveDeckValues(deckPreset, {
      includeQuestionMark,
      includeCoffeeBreak,
    });
    return values.slice(0, 6).join(" · ");
  }, [deckPreset, includeQuestionMark, includeCoffeeBreak]);

  const handleLaunch = async () => {
    setLoading(true);
    setError(null);
    try {
      const operatorId = getOrCreateOperatorId();
      const session = await createSession({
        createdBy: operatorId,
        name: sessionName.trim() ? sessionName.trim() : undefined,
        deckPreset,
        includeQuestionMark,
        includeCoffeeBreak,
        autoReveal,
      });
      setOpen(false);
      router.push(`/session/${session.slug}`);
    } catch (err) {
      console.error(err);
      setError("Failed to launch the session. Please try again.");
    } finally {
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
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Tune your session</DialogTitle>
            <DialogDescription>
              Dial in the deck, safety valves, and reveal behaviour before your
              crew beams in.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
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
                    onClick={() => setDeckPreset(deck.value)}
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

          {error ? (
            <p className="text-sm font-medium text-destructive">{error}</p>
          ) : null}

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-3">
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
        </form>
      </DialogContent>
    </Dialog>
  );
};
