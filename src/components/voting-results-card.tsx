"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Vote } from "@/schema/vote";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PersonStanding, CircleMinus, Wifi } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { PresenceUser } from "@/hooks/usePresence";

type VotingResultsCardProps = {
  sessionId: string;
  showVotes: boolean;
  presenceUsers: PresenceUser[];
};

type UserStatus = {
  username: string;
  isOnline: boolean;
  vote: Vote | null;
  isTemporary: boolean;
};

export const VotingResultsCard = ({
  sessionId,
  showVotes,
  presenceUsers,
}: VotingResultsCardProps) => {
  const { data: votes, isLoading } = useSWR(
    `/api/session/${sessionId}/votes`,
    fetcher,
  );

  if (isLoading) {
    return <Skeleton className="flex flex-col gap-2 p-2" />;
  }

  const voteList = Array.isArray(votes) ? votes : [];

  // Create a merged list of all users (present + voted)
  const userStatusMap = new Map<string, UserStatus>();

  // Add all present users
  presenceUsers.forEach((user) => {
    userStatusMap.set(user.username, {
      username: user.username,
      isOnline: true,
      vote: null,
      isTemporary: user.isTemporary,
    });
  });

  // Add/update with vote information
  voteList.forEach((vote: Vote) => {
    const existing = userStatusMap.get(vote.voterName);
    if (existing) {
      existing.vote = vote;
    } else {
      // User voted but is now offline
      userStatusMap.set(vote.voterName, {
        username: vote.voterName,
        isOnline: false,
        vote: vote,
        isTemporary: false,
      });
    }
  });

  const userStatuses = Array.from(userStatusMap.values()).sort((a, b) =>
    a.username.localeCompare(b.username),
  );

  return (
    <Card className="flex h-fit flex-col gap-4 p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-xl font-semibold text-primary">
          Live Telemetry
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Session {sessionId}
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[340px] space-y-3 overflow-auto p-0">
        {userStatuses.length === 0 && (
          <div className="rounded-lg border border-dashed border-primary/30 bg-secondary/30 p-6 text-center text-sm text-muted-foreground">
            No operators detected yet. Waiting for connections…
          </div>
        )}
        <ul className="space-y-2 text-sm [font-family:var(--font-mono),monospace]">
          {userStatuses.map((user) => (
            <li
              key={user.username}
              className="flex items-center justify-between rounded-lg border border-primary/10 bg-secondary/30 px-3 py-2 text-foreground/90"
            >
              <span className="flex items-center gap-2 tracking-tight">
                {user.isOnline ? (
                  <Wifi className="size-4 text-green-500" />
                ) : (
                  <PersonStanding className="size-4 text-muted-foreground/50" />
                )}
                <span className={!user.isOnline ? "text-muted-foreground" : ""}>
                  {user.username}
                </span>
              </span>
              {user.vote ? (
                showVotes ? (
                  <span className="rounded bg-primary/20 px-2 py-1 text-sm font-semibold text-primary-foreground">
                    {user.vote.value}
                  </span>
                ) : (
                  <span className="text-muted-foreground">•••</span>
                )
              ) : user.isOnline ? (
                <CircleMinus className="size-4 text-muted-foreground/50" />
              ) : null}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
