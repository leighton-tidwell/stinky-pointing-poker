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
import { StoryPointsKeyTable } from "./story-points-key-table";

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Story description"
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
        <div className="flex gap-2">
          <Button
            disabled={loading}
            className="w-fit"
            onClick={handleUpdateDescription}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <span className="block md:hidden">Update</span>
                <span className="hidden md:block">Update Description</span>
              </>
            )}
          </Button>
          {session?.showVotes ? (
            <Button
              disabled={loading}
              className="w-fit"
              onClick={handleHideVotes}
              variant="ghost"
            >
              {loading ? <Spinner /> : "Hide Votes"}
            </Button>
          ) : (
            <Button
              disabled={loading}
              className="w-fit"
              onClick={handleShowVotes}
              variant="ghost"
            >
              {loading ? <Spinner /> : "Show Votes"}
            </Button>
          )}
          <Button
            disabled={loading}
            className="ml-auto w-fit"
            onClick={() => handleClearVotes()}
            variant="destructive"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Trash size={18} />
                <span className="hidden md:block">Clear Votes</span>
              </>
            )}
          </Button>
        </div>
      </div>
      <StoryPointsKeyTable />
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
