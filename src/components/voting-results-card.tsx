"use client";
import { Vote } from "@/schema/vote";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PersonStanding, CircleMinus, Wifi } from "lucide-react";
import { PresenceUser } from "@/hooks/usePresence";

type VotingResultsCardProps = {
  sessionSlug: string;
  showVotes: boolean;
  presenceUsers: PresenceUser[];
  votes: Vote[];
};

type UserStatus = {
  username: string;
  isOnline: boolean;
  vote: Vote | null;
  isTemporary: boolean;
};

const AnimatedVote = ({
  value,
  isRevealed,
}: {
  value: string;
  isRevealed: boolean;
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 600);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <span
      className={`inline-block rounded px-2 py-1 text-sm font-semibold transition-all duration-300 ${
        isRevealed
          ? "bg-primary/20 text-primary-foreground"
          : "text-muted-foreground"
      } ${animate ? "scale-125 shadow-[0_0_20px_rgba(var(--primary-rgb,34,197,94),0.5)]" : "scale-100"}`}
    >
      {isRevealed ? value : "•••"}
    </span>
  );
};

export const VotingResultsCard = ({
  sessionSlug,
  showVotes,
  presenceUsers,
  votes,
}: VotingResultsCardProps) => {
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
          Operator Status Grid
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Who&apos;s online and where the votes landed
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
                <AnimatedVote value={user.vote.value} isRevealed={showVotes} />
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
