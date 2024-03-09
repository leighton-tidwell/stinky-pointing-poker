import { JoinSessionForm } from "@/components/forms/join-session-form";
import { StartSessionButton } from "@/components/start-session-button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle className="font-extrabold">
            Stinky Pointing Poker
          </CardTitle>
          <CardDescription>Created by ol&apos; Tidwellius</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <JoinSessionForm />
        </CardContent>
        <CardFooter className="flex-col gap-8">
          <Separator />
          <span className="m-auto flex-1">Or you can start a new one 👌</span>
          <StartSessionButton />
        </CardFooter>
      </Card>
    </main>
  );
}
