"use client";

import { Activity } from "lucide-react";
import { useActiveSessions } from "@/hooks/useActiveSessions";
import { cn } from "@/lib/utils";

export const ActiveSessionsBeacon = () => {
  const { activeCount } = useActiveSessions();

  const pulse = activeCount > 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl border border-primary/30 bg-secondary/40 px-4 py-3 shadow-[0_12px_30px_rgba(6,20,11,0.45)] backdrop-blur",
        pulse ? "animate-[pulse_3s_ease-in-out_infinite]" : "",
      )}
    >
      <div className="relative" aria-hidden>
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg" />
        <Activity className="relative size-5 text-primary" />
      </div>
      <div className="flex flex-col text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
        <span>Live uplinks</span>
        <span className="text-base tracking-[0.1em] text-primary">
          {activeCount.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};
