import { JoinSessionForm } from "@/components/forms/join-session-form";
import { StartSessionButton } from "@/components/start-session-button";
import { ActiveSessionsBeacon } from "@/components/active-sessions-beacon";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, ArrowUpRight, Check, Code2 } from "lucide-react";
import Link from "next/link";

const featureList = [
  "Realtime signal updates across the fleet",
  "Votes stay encrypted until you say otherwise",
  "Zero-friction sessions for remote teams",
];

export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center px-6 py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-10 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute right-10 bottom-[-120px] h-[320px] w-[320px] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-[1.1fr_minmax(0,0.95fr)]">
        <section className="space-y-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary/40 px-4 py-1 text-xs uppercase tracking-[0.35em] text-primary">
            <Code2 className="size-3" /> Distributed estimation
          </span>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Minimalist planning poker built for teams who ship like
              engineers.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground">
              Stinky Pointing Poker keeps your estimation rounds lightweight,
              legible, and a little rebellious. Drop in a session, invite the
              crew, and transmit consensus without slowing momentum.
            </p>
          </div>
          <ul className="space-y-4 text-sm text-muted-foreground">
            {featureList.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 rounded-lg border border-primary/10 bg-secondary/20 px-4 py-3 [font-family:var(--font-mono),monospace] text-xs tracking-[0.2em] text-foreground/80"
              >
                <Check className="size-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-4">
            <StartSessionButton />
            <Link
              href="https://github.com/leighton-tidwell/stinky-pointing-poker"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
            >
              <Github className="size-5" /> Star the repo
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </section>

        <Card className="relative overflow-hidden border border-primary/25 bg-card/80 p-0 shadow-[0_25px_60px_rgba(6,20,11,0.55)]">
          <div className="flex items-center justify-between border-b border-primary/15 bg-secondary/30 px-5 py-3 [font-family:var(--font-mono),monospace] text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span>Session uplink</span>
            <div className="flex gap-2">
              <span className="size-2 rounded-full bg-primary/80" />
              <span className="size-2 rounded-full bg-accent/70" />
              <span className="size-2 rounded-full bg-muted" />
            </div>
          </div>
          <CardHeader className="space-y-2 px-6 pt-8">
            <CardTitle className="text-2xl font-semibold text-primary">
              Beam into an existing round
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Drop the session ID your squad shared and you&apos;ll sync with the
              live board instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <JoinSessionForm />
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-center">
          <ActiveSessionsBeacon />
        </div>
      </div>
    </main>
  );
}
