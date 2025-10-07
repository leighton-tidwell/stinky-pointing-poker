import Link from "next/link";
import { Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

export const TipJar = () => {
  return (
    <Link
      href="https://ko-fi.com/leightontidwell"
      target="_blank"
      rel="noreferrer"
      aria-label="Tip the maker on Ko-fi"
      className={cn(
        "fixed bottom-6 right-6 z-[900] inline-flex items-center gap-3 rounded-full border border-primary/20 bg-secondary/30 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground shadow-[0_12px_34px_rgba(6,20,11,0.45)] backdrop-blur transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        "sm:bottom-8 sm:right-8",
      )}
    >
      <span className="relative flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-primary/30 opacity-60 blur-lg" />
        <Coffee className="relative size-4 text-primary" />
      </span>
      <span className="hidden sm:inline">Fuel the signal</span>
      <span className="sm:hidden">Ko-fi</span>
    </Link>
  );
};
