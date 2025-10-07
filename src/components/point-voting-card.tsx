import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const POINT_VALUES = ["1", "2", "3", "5", "8", "13", "21", "?"];

type PointVotingCardProps = {
  handleCastVote: (value: string) => Promise<void>;
};

export const PointVotingCard = ({ handleCastVote }: PointVotingCardProps) => {
  return (
    <Card className="flex h-fit flex-col gap-4 p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-xl font-semibold text-primary">
          Voting Console
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Choose a signal to transmit
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-4 gap-2">
          {POINT_VALUES.map((value) => (
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
