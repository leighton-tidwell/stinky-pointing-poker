import { ReactNode } from "react";
import { Home, Github } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionBySlug } from "@/schema/session";
import { TipJar } from "@/components/tip-jar";

export default async function SessionLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const session = await getSessionBySlug(slug);

  if (!session) {
    redirect("/");
  }

  const heading = session.name?.trim()
    ? session.name
    : "Stinky Pointing Poker Console";

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-secondary/30 px-8 py-7 shadow-[0_18px_60px_rgba(6,20,11,0.55)] backdrop-blur">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-36 w-36 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary/40 px-4 py-1 text-xs uppercase tracking-[0.35em] text-primary">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              Session live
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-primary">{heading}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 [font-family:var(--font-mono),monospace] text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-4 py-2 text-primary transition hover:border-primary hover:bg-primary/20 hover:text-primary-foreground"
            >
              <Home className="size-4" /> Dashboard
            </Link>
            <a
              href="https://github.com/leighton-tidwell/stinky-pointing-poker"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/15 bg-secondary/40 px-4 py-2 transition hover:border-primary/30 hover:bg-secondary/50"
            >
              <Github className="size-4 text-primary" /> Repo
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-10 pb-16">{children}</div>
      <TipJar />
    </div>
  );
}
