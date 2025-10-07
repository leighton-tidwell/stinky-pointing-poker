"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type SessionActivityMap = Record<
  string,
  {
    count: number;
    updatedAt: number;
  }
>;

const ACTIVITY_TTL_MS = 45_000;
const PRUNE_INTERVAL_MS = 10_000;

export const useActiveSessions = () => {
  const [sessions, setSessions] = useState<SessionActivityMap>({});

  useEffect(() => {
    const channel = supabase.channel("sessions:telemetry", {
      config: { broadcast: { self: true } },
    });

    channel
      .on("broadcast", { event: "session-activity" }, ({ payload }) => {
        if (!payload?.slug) return;

        setSessions((prev) => {
          const next = { ...prev };
          next[payload.slug] = {
            count: Number(payload.activeCount) || 0,
            updatedAt: typeof payload.timestamp === "number" ? payload.timestamp : Date.now(),
          };
          return next;
        });
      })
      .subscribe();

    const interval = setInterval(() => {
      setSessions((prev) => {
        const now = Date.now();
        let changed = false;
        const next: SessionActivityMap = {};

        Object.entries(prev).forEach(([slug, info]) => {
          if (now - info.updatedAt <= ACTIVITY_TTL_MS) {
            next[slug] = info;
          } else {
            changed = true;
          }
        });

        if (changed || Object.keys(next).length !== Object.keys(prev).length) {
          return next;
        }

        return prev;
      });
    }, PRUNE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      channel.unsubscribe();
    };
  }, []);

  const activeCount = useMemo(() => {
    const now = Date.now();
    return Object.values(sessions).filter(
      (session) => session.count > 0 && now - session.updatedAt <= ACTIVITY_TTL_MS,
    ).length;
  }, [sessions]);

  return { activeCount };
};
