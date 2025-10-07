"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Vote } from "@/schema/vote";
import { useEffect, useState } from "react";

const POINT_VALUES = ["1", "2", "3", "5", "8", "13", "21", "?"];

type AverageVoteCardProps = { showVotes: boolean; votes: Vote[] };

const calculateAverageVote = (votes?: Vote[]) => {
  const filteredVotes = votes?.filter((vote) => vote.value !== "?");

  const total =
    filteredVotes?.reduce((acc, vote) => {
      return acc + parseInt(vote.value, 10);
    }, 0) ?? 0;

  const totalVotes = filteredVotes?.length ?? 0;

  return (total / totalVotes).toFixed(2);
};

export const AverageVoteCard = ({ showVotes, votes }: AverageVoteCardProps) => {
  const hasVotes = votes?.length ?? 0;
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (hasVotes > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [hasVotes]);

  return (
    <Card className="flex h-fit flex-col gap-4 p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-xl font-semibold text-primary">
          Consensus Radar
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Collective signal strength
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-6 p-0">
        {!hasVotes ? (
          <div className="rounded-lg border border-dashed border-primary/30 bg-secondary/30 p-6 text-sm text-muted-foreground">
            Awaiting transmissions. Once everyone locks in, the average will
            materialise here.
          </div>
        ) : (
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              {showVotes ? "Live average" : "Encrypted average"}
            </span>
            <div className="flex items-baseline gap-3">
              <span
                className={`text-5xl font-bold text-primary transition-all duration-300 ${
                  animate
                    ? "scale-110 drop-shadow-[0_0_15px_rgba(var(--primary-rgb,34,197,94),0.7)]"
                    : "scale-100"
                }`}
              >
                {showVotes ? calculateAverageVote(votes) : "•••"}
              </span>
              <span className="text-sm text-muted-foreground">
                {showVotes ? "points" : "reveals once votes unlock"}
              </span>
            </div>
          </div>
        )}
        <div className="rounded-lg border border-primary/10 bg-secondary/20 p-4 text-xs text-muted-foreground">
          <span className="font-semibold text-primary">Tip:</span> Challenge the
          outliers before revealing to keep your estimates sharp.
        </div>
      </CardContent>
    </Card>
  );
};
