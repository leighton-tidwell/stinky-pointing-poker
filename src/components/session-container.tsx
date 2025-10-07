"use client";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateSession, getSession } from "@/actions/session";
import {
  getVotesBySessionId,
  castVote,
  clearVotesForSession,
} from "@/actions/vote";
import { Spinner } from "./spinner";
import { UsernameDialog } from "./dialogs/username-dialog";
import { Trash } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/lib/utils";
import { VotingResultsCard } from "./voting-results-card";
import { PointVotingCard } from "./point-voting-card";
import { AverageVoteCard } from "./average-vote-card";

type SessionContainerProps = {
  initialSession: any;
  initialVotes: any;
};

export const SessionContainer = ({
  initialSession,
  initialVotes,
}: SessionContainerProps) => {
  const { mutate } = useSWRConfig();
  const { data: session } = useSWR(
    `/api/session/${initialSession.id}`,
    fetcher,
    {
      initialData: initialSession,
      refreshInterval: 1000,
    },
  );
  const { data: votes } = useSWR(
    `/api/session/${initialSession.id}/votes`,
    fetcher,
    {
      initialData: initialVotes,
      refreshInterval: 1000,
    },
  );

  const [initialLoad, setInitialLoad] = useState(true);
  const [username, setUsername] = useState("");
  const [storyDescription, setStoryDescription] = useState(
    initialSession?.storyDescription,
  );
  const [loading, setIsLoading] = useState(false);

  const handleUpdateDescription = async () => {
    setIsLoading(true);
    try {
      await updateSession(session.id, {
        storyDescription,
      });
      mutate(`/api/session/${session.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowVotes = async () => {
    setIsLoading(true);
    try {
      await updateSession(session.id, {
        showVotes: true,
      });
      mutate(`/api/session/${session.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHideVotes = async () => {
    setIsLoading(true);
    try {
      await updateSession(session.id, {
        showVotes: false,
      });
      mutate(`/api/session/${session.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCastVote = async (value: string) => {
    await castVote(session.id, username, value);
    mutate(`/api/session/${session.id}/votes`);
  };

  const handleClearVotes = async () => {
    setIsLoading(true);
    await clearVotesForSession(session.id);
    await updateSession(session.id, {
      storyDescription: "",
      showVotes: false,
    });
    mutate(`/api/session/${session.id}/votes`);
    mutate(`/api/session/${session.id}`);
    setIsLoading(false);
  };

  useEffect(() => {
    if (session) {
      setStoryDescription(session.storyDescription);
    }
  }, [session]);

  const voteList = Array.isArray(votes) ? votes : [];
  const uniqueVoters = new Set(voteList.map((vote) => vote.voterName)).size;
  const votesLocked = session?.showVotes;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-3">
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
          <div className="flex flex-wrap gap-3">
            <Button
              disabled={loading}
              onClick={handleUpdateDescription}
              className="gap-2"
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <span>Sync Story</span>
                </>
              )}
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
              onClick={() => handleClearVotes()}
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
        </div>
        <div className="grid h-full gap-3 rounded-xl border border-primary/15 bg-secondary/20 p-4 text-xs uppercase tracking-[0.35em] text-muted-foreground">
          <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-secondary/30 px-4 py-3 text-foreground/80">
            <span>Active operators</span>
            <span className="text-lg font-semibold text-primary">
              {uniqueVoters}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-secondary/30 px-4 py-3 text-foreground/80">
            <span>Vote status</span>
            <span className="text-lg font-semibold text-primary">
              {votesLocked ? "Decrypted" : "Encrypted"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-secondary/30 px-4 py-3 text-foreground/80">
            <span>Ping</span>
            <span className="text-lg font-semibold text-accent">
              {loading ? "..." : "Stable"}
            </span>
          </div>
        </div>
      </div>

      {/* Point Voting Panel */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        {/* Point value vote buttons */}
        <PointVotingCard handleCastVote={handleCastVote} />

        {/* Voting Results */}
        <VotingResultsCard
          sessionId={session?.id}
          showVotes={session?.showVotes}
        />

        {/* Voting average */}
        <AverageVoteCard showVotes={session?.showVotes} votes={votes} />
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
