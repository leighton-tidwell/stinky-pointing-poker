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
    <Card className="flex h-fit flex-col gap-2 p-2">
      <CardHeader>
        <CardTitle>Point Voting</CardTitle>
        <CardDescription>Choose a point value</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {POINT_VALUES.map((value) => (
            <Button
              key={value}
              className="flex-1 rounded bg-blue-500 p-2 text-white"
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
