"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

type Session = {
  id: number;
  name: string;
  storyDescription: string;
  showVotes: boolean;
  createdBy: string | null;
  createdAt: Date;
};

type Vote = { id: number; voterName: string; value: string; sessionId: string };

export const useRealtimeSession = (
  initialSession: Session,
  initialVotes: Vote[],
) => {
  const [session, setSession] = useState<Session>(initialSession);
  const [votes, setVotes] = useState<Vote[]>(initialVotes);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const channelName = `session:${initialSession.id}:updates`;
    const realtimeChannel = supabase.channel(channelName);

    realtimeChannel
      .on("broadcast", { event: "session-update" }, ({ payload }) => {
        setSession((prev) => ({ ...prev, ...payload }));
      })
      .on("broadcast", { event: "vote-cast" }, ({ payload }) => {
        setVotes((prev) => {
          const existingIndex = prev.findIndex(
            (v) => v.voterName === payload.voterName,
          );
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = payload;
            return updated;
          }
          return [...prev, payload];
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
  }, [initialSession.id]);

  return { session, votes, channel };
};
