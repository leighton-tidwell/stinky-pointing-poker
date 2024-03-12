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

  const sortedVotesByUserName = votes?.sort((a: Vote, b: Vote) =>
    a.voterName.localeCompare(b.voterName),
  );

  return (
    <Card className="flex h-fit flex-col gap-2 p-2">
      <CardHeader>
        <CardTitle>Voting Results</CardTitle>
        <CardDescription>Results for session {sessionId}</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[350px] overflow-auto">
        {votes.length === 0 && <div>No votes yet</div>}
        <ul>
          {sortedVotesByUserName.map((vote: Vote) => (
            <li key={vote.id} className="flex gap-2">
              <PersonStanding /> {vote.voterName} voted{" "}
              {showVotes && vote.value}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
