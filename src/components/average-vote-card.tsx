import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vote } from "@/schema/vote";

const POINT_VALUES = ["1", "2", "3", "5", "8", "13", "21", "?"];

type AverageVoteCardProps = {
  showVotes: boolean;
  votes: Vote[];
};

const calculateAverageVote = (votes?: Vote[]) => {
  const total =
    votes?.reduce((acc, vote) => {
      return acc + parseInt(vote.value, 10);
    }, 0) ?? 0;

  const totalVotes = votes?.length ?? 0;

  return (total / totalVotes).toFixed(2);
};

export const AverageVoteCard = ({ showVotes, votes }: AverageVoteCardProps) => {
  return (
    <Card className="flex h-fit flex-col gap-2 p-2">
      <CardHeader>
        <CardTitle>Average Vote</CardTitle>
        <CardDescription>
          {showVotes ? "Results" : "Waiting for votes"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {votes?.length === 0 ? (
          <div>No votes yet</div>
        ) : (
          <div>
            <div>
              {showVotes
                ? "The average vote is"
                : "The average vote will appear here once all votes are in"}
            </div>
            <div className="text-2xl font-extrabold">
              {showVotes ? calculateAverageVote(votes) : "¯\\_(ツ)_/¯"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
