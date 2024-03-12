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
import { Github, GithubIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center">
      <Card className="m-2 md:m-0 md:w-1/2">
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
          <a
            title="Star it on Github"
            target="_blank"
            href="https://github.com/leighton-tidwell/stinky-pointing-poker"
          >
            <Github size={45} className="rounded-full bg-slate-200 p-3" />
          </a>
        </CardFooter>
      </Card>
    </main>
  );
}
