"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Vote } from "@/schema/vote";
import { RollingNumber } from "./rolling-number";
import { isNumericVoteValue } from "@/lib/decks";

type AverageVoteCardProps = {
  showVotes: boolean;
  votes: Vote[];
  supportsAverage: boolean;
};

const calculateAverageVote = (votes?: Vote[]) => {
  const numericVotes = votes?.filter((vote) => isNumericVoteValue(vote.value));

  if (!numericVotes || numericVotes.length === 0) {
    return null;
  }

  const total = numericVotes.reduce((acc, vote) => acc + Number(vote.value), 0);

  return total / numericVotes.length;
};

export const AverageVoteCard = ({
  showVotes,
  votes,
  supportsAverage,
}: AverageVoteCardProps) => {
  const averageValue = calculateAverageVote(votes ?? []);
  const hasVotes = (votes?.length ?? 0) > 0;

  const canDisplayAverage = supportsAverage && averageValue !== null;

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
        {!supportsAverage ? (
          <div className="rounded-lg border border-dashed border-primary/30 bg-secondary/30 p-6 text-sm text-muted-foreground">
            This deck speaks in vibes, not velocity. Swap to a numeric deck to
            chart an average signal.
          </div>
        ) : !hasVotes ? (
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
              {showVotes ? (
                canDisplayAverage ? (
                  <RollingNumber
                    value={averageValue ?? 0}
                    className="text-5xl font-bold text-primary"
                    decimalPlaces={2}
                    colorPulseOnUpdate
                  />
                ) : (
                  <span className="text-5xl font-bold text-primary">---</span>
                )
              ) : (
                <span className="text-5xl font-bold text-primary">•••</span>
              )}
              <span className="text-sm text-muted-foreground">
                {showVotes
                  ? supportsAverage && canDisplayAverage
                    ? "points"
                    : "no numeric consensus"
                  : "reveals once votes unlock"}
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
