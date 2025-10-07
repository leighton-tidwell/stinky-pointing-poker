"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateSession } from "@/actions/session";
import { castVote, clearVotesForSession } from "@/actions/vote";
import { Spinner } from "./spinner";
import { UsernameDialog } from "./dialogs/username-dialog";
import { Trash } from "lucide-react";
import { VotingResultsCard } from "./voting-results-card";
import { PointVotingCard } from "./point-voting-card";
import { AverageVoteCard } from "./average-vote-card";
import { usePresence } from "@/hooks/usePresence";
import { useRealtimeSession } from "@/hooks/useRealtimeSession";
import { usePing } from "@/hooks/usePing";
import {
  getDeckDefinition,
  resolveDeckValues,
  supportsAverageForDeck,
  type DeckPreset,
} from "@/lib/decks";
import type { SessionRecord } from "@/schema/session";
import type { Vote } from "@/schema/vote";
import { CopySessionCodeField } from "@/components/copy-session-code-field";

const metricItemClasses =
  "flex items-center justify-between rounded-lg border border-primary/20 bg-secondary/30 px-4 py-3 text-foreground/80";

const formatBoolean = (value: boolean) => (value ? "On" : "Off");

const sanitizeDeckPreset = (preset: SessionRecord["deckPreset"]) =>
  (preset as DeckPreset) ?? "fibonacci";

type SessionContainerProps = {
  initialSession: SessionRecord;
  initialVotes: Vote[];
};

export const SessionContainer = ({
  initialSession,
  initialVotes,
}: SessionContainerProps) => {
  const { session, votes } = useRealtimeSession(initialSession, initialVotes);

  const [initialLoad, setInitialLoad] = useState(true);
  const [username, setUsername] = useState("");
  const [storyDescription, setStoryDescription] = useState(
    initialSession?.storyDescription ?? "",
  );
  const [loading, setIsLoading] = useState(false);

  const { presenceUsers, operatorId, activeOperatorsCount, channel } =
    usePresence(initialSession.slug, username);
  const { ping, isStable } = usePing(channel);

  const voteList = useMemo(() => (Array.isArray(votes) ? votes : []), [votes]);
  const votesLocked = session?.showVotes;
  const isCreator = session?.createdBy === operatorId;

  const deckPreset = sanitizeDeckPreset(session?.deckPreset);
  const customDeckValues = useMemo(
    () => (Array.isArray(session?.customDeckValues) ? session.customDeckValues : []),
    [session?.customDeckValues],
  );
  const deckDefinition = useMemo(() => getDeckDefinition(deckPreset), [deckPreset]);
  const resolvedDeckValues = useMemo(
    () =>
      resolveDeckValues(
        deckPreset,
        {
          includeQuestionMark: session?.includeQuestionMark ?? true,
          includeCoffeeBreak: session?.includeCoffeeBreak ?? false,
        },
        deckPreset === "custom" ? customDeckValues : undefined,
      ),
    [
      deckPreset,
      session?.includeQuestionMark,
      session?.includeCoffeeBreak,
      customDeckValues,
    ],
  );
  const deckSupportsAverage = supportsAverageForDeck(
    deckPreset,
    deckPreset === "custom" ? customDeckValues : undefined,
    session?.customDeckAverageEnabled,
  );

  const autoRevealTriggeredRef = useRef(false);

  useEffect(() => {
    if (session) {
      setStoryDescription(session.storyDescription ?? "");
    }
  }, [session]);

  const handleUpdateDescription = useCallback(async () => {
    if (!storyDescription.trim()) {
      setStoryDescription("");
    }
    setIsLoading(true);
    try {
      await updateSession(session.id.toString(), {
        storyDescription: storyDescription.trim(),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [session.id, storyDescription]);

  const handleShowVotes = useCallback(async () => {
    setIsLoading(true);
    try {
      await updateSession(session.id.toString(), { showVotes: true });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [session.id]);

  const handleHideVotes = useCallback(async () => {
    setIsLoading(true);
    try {
      await updateSession(session.id.toString(), { showVotes: false });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [session.id]);

  const handleCastVote = useCallback(
    async (value: string) => {
      await castVote(session.slug, username || operatorId, value);
    },
    [session.slug, username, operatorId],
  );

  const handleClearVotes = useCallback(async () => {
    setIsLoading(true);
    try {
      await clearVotesForSession(session.slug);
      await updateSession(session.id.toString(), {
        storyDescription: "",
        showVotes: false,
      });
      setStoryDescription("");
      autoRevealTriggeredRef.current = false;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [session.id, session.slug]);

  useEffect(() => {
    if (!session.autoReveal || session.showVotes || !isCreator) {
      autoRevealTriggeredRef.current = false;
      return;
    }

    const activeUsers = presenceUsers.filter((user) => !user.isTemporary);
    if (activeUsers.length === 0) return;

    const everyoneVoted = activeUsers.every((user) =>
      voteList.some((vote) => vote.voterName === user.username),
    );

    if (everyoneVoted && !autoRevealTriggeredRef.current) {
      autoRevealTriggeredRef.current = true;
      handleShowVotes();
    }
  }, [
    session.autoReveal,
    session.showVotes,
    isCreator,
    presenceUsers,
    voteList,
    handleShowVotes,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <CopySessionCodeField code={session.slug} />
          <label
            htmlFor="story-description"
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            Story descriptor
          </label>
          <Textarea
            id="story-description"
            placeholder="Describe the story, acceptance criteria, or edge cases..."
            value={storyDescription}
            onChange={(event) => {
              setStoryDescription(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && storyDescription) {
                handleUpdateDescription();
              }
            }}
          />
          {isCreator && (
            <div className="flex flex-wrap gap-3">
              <Button
                disabled={loading}
                onClick={handleUpdateDescription}
                className="gap-2"
              >
                {loading ? <Spinner /> : <span>Sync Story</span>}
              </Button>
              <Button
                disabled={loading}
                onClick={votesLocked ? handleHideVotes : handleShowVotes}
                variant="outline"
                className="gap-2 border-primary/30 text-primary"
              >
                {loading ? <Spinner /> : votesLocked ? "Mask Votes" : "Reveal Votes"}
              </Button>
              <Button
                disabled={loading}
                onClick={handleClearVotes}
                variant="destructive"
                className="gap-2"
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <Trash size={16} />
                    <span className="hidden md:inline">Reset Round</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        <div className="grid h-full gap-3 rounded-xl border border-primary/15 bg-secondary/20 p-4 text-xs uppercase tracking-[0.35em] text-muted-foreground">
          <div className={metricItemClasses}>
            <span>Active operators</span>
            <span className="text-lg font-semibold text-primary">
              {activeOperatorsCount}
            </span>
          </div>
          <div className={metricItemClasses}>
            <span>Ping</span>
            <span
              className={`text-lg font-semibold ${
                ping === null
                  ? "text-muted-foreground"
                  : isStable
                    ? "text-accent"
                    : "text-destructive"
              }`}
            >
              {ping === null ? "..." : `${ping}ms`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        <div className="order-1">
          <PointVotingCard
            handleCastVote={handleCastVote}
            deckValues={resolvedDeckValues}
            deckLabel={deckDefinition.label}
            deckDescription={deckDefinition.description}
          />
        </div>

        <div className="order-3 md:order-2">
          <VotingResultsCard
            sessionSlug={session.slug}
            showVotes={Boolean(session.showVotes)}
            presenceUsers={presenceUsers}
            votes={votes}
          />
        </div>

        <div className="order-2 md:order-3">
          <AverageVoteCard
            showVotes={Boolean(session.showVotes)}
            votes={votes}
            supportsAverage={deckSupportsAverage}
            preset={deckPreset}
            customAverageEnabled={Boolean(session.customDeckAverageEnabled)}
            customValues={deckPreset === "custom" ? customDeckValues : undefined}
          />
        </div>
      </div>
      {initialLoad && (
        <UsernameDialog
          setOpen={() => username && setInitialLoad(false)}
          username={username}
          setUsername={setUsername}
        />
      )}
    </div>
  );
};
