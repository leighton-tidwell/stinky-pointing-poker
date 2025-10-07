import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PointVotingCardProps = {
  handleCastVote: (value: string) => Promise<void>;
  deckValues: string[];
  deckLabel: string;
  deckDescription: string;
};

export const PointVotingCard = ({
  handleCastVote,
  deckValues,
  deckLabel,
  deckDescription,
}: PointVotingCardProps) => {
  return (
    <Card className="flex h-fit flex-col gap-4 p-4">
      <CardHeader className="p-0">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold text-primary">
            Voting Console
          </CardTitle>
          <CardDescription className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {deckLabel}
          </CardDescription>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {deckDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-4 gap-2">
          {deckValues.map((value) => (
            <Button
              key={value}
              variant="ghost"
              className="h-12 border border-primary/20 bg-secondary/40 text-lg font-semibold text-foreground/90 transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/20 hover:text-primary-foreground"
              onClick={() => handleCastVote(value)}
            >
              {value}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
