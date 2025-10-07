"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { SessionRecord } from "@/schema/session";
import type { Vote } from "@/schema/vote";

export const useRealtimeSession = (
  initialSession: SessionRecord,
  initialVotes: Vote[],
) => {
  const [session, setSession] = useState<SessionRecord>(initialSession);
  const [votes, setVotes] = useState<Vote[]>(initialVotes);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const channelName = `session:${initialSession.slug}:updates`;
    const realtimeChannel = supabase.channel(channelName);

    realtimeChannel
      .on("broadcast", { event: "session-update" }, ({ payload }) => {
        setSession((prev) => ({ ...prev, ...payload }));
      })
      .on("broadcast", { event: "vote-cast" }, ({ payload }) => {
        setVotes((prev) => {
          const existingIndex = prev.findIndex(
            (vote) => vote.voterName === payload.voterName,
          );

          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = payload as Vote;
            return updated;
          }

          return [...prev, payload as Vote];
        });
      })
      .on("broadcast", { event: "votes-cleared" }, () => {
        setVotes([]);
      })
      .subscribe();

    setChannel(realtimeChannel);

    return () => {
      realtimeChannel.unsubscribe();
    };
  }, [initialSession.slug]);

  return { session, votes, channel };
};
