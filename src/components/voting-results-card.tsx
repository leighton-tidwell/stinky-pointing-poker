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
import { PersonStanding } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type VotingResultsCardProps = {
  sessionId: string;
  showVotes: boolean;
};

export const VotingResultsCard = ({
  sessionId,
  showVotes,
}: VotingResultsCardProps) => {
  const { data: votes, isLoading } = useSWR(
    `/api/session/${sessionId}/votes`,
    fetcher,
  );

  if (isLoading) {
    return <Skeleton className="flex flex-col gap-2 p-2" />;
  }

  const voteList = Array.isArray(votes) ? votes : [];
  const sortedVotesByUserName = [...voteList].sort((a: Vote, b: Vote) =>
    a.voterName.localeCompare(b.voterName),
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
        {voteList.length === 0 && (
          <div className="rounded-lg border border-dashed border-primary/30 bg-secondary/30 p-6 text-center text-sm text-muted-foreground">
            No votes detected yet. Waiting for operators…
          </div>
        )}
        <ul className="space-y-2 [font-family:var(--font-mono),monospace] text-sm">
          {sortedVotesByUserName.map((vote: Vote) => (
            <li
              key={vote.id}
              className="flex items-center justify-between rounded-lg border border-primary/10 bg-secondary/30 px-3 py-2 text-foreground/90"
            >
              <span className="flex items-center gap-2 tracking-tight">
                <PersonStanding className="size-4 text-primary/80" />
                <span>{vote.voterName}</span>
              </span>
              {showVotes ? (
                <span className="rounded bg-primary/20 px-2 py-1 text-sm font-semibold text-primary-foreground">
                  {vote.value}
                </span>
              ) : (
                <span className="text-muted-foreground">•••</span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
