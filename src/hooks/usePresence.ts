"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type PresenceUser = {
  userId: string;
  username: string;
  isTemporary: boolean;
};

const generateOperatorId = () => {
  if (typeof window !== "undefined") {
    let operatorId = localStorage.getItem("operatorId");
    if (!operatorId) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      operatorId = `Operator-${randomNum}`;
      localStorage.setItem("operatorId", operatorId);
    }
    return operatorId;
  }
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `Operator-${randomNum}`;
};

export const usePresence = (sessionSlug: string, username: string) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);
  const [operatorId] = useState(() => generateOperatorId());
  const telemetryChannelRef = useRef<RealtimeChannel | null>(null);
  const telemetryReadyRef = useRef(false);
  const lastBroadcastRef = useRef<number | null>(null);

  useEffect(() => {
    const channelName = `session:${sessionSlug}`;
    const presenceChannel = supabase.channel(channelName, {
      config: {
        presence: { key: operatorId },
        broadcast: { self: true }, // Enable receiving own broadcasts for ping measurement
      },
    });

    const telemetryChannel = supabase.channel("sessions:telemetry", {
      config: { broadcast: { self: true } },
    });

    telemetryChannelRef.current = telemetryChannel;

    telemetryChannel.subscribe((status) => {
      telemetryReadyRef.current = status === "SUBSCRIBED";
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const users: PresenceUser[] = [];

        Object.keys(state).forEach((userId) => {
          const presence = state[userId]?.[0] as any;
          if (presence) {
            users.push({
              userId,
              username: presence.username || userId,
              isTemporary: presence.isTemporary || false,
            });
          }
        });

        setPresenceUsers(users);

        const activeCount = users.length;

        if (
          telemetryReadyRef.current &&
          telemetryChannelRef.current &&
          lastBroadcastRef.current !== activeCount
        ) {
          telemetryChannelRef.current.send({
            type: "broadcast",
            event: "session-activity",
            payload: {
              slug: sessionSlug,
              activeCount,
              timestamp: Date.now(),
            },
          });
          lastBroadcastRef.current = activeCount;
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            username: username || operatorId,
            isTemporary: !username,
            online_at: new Date().toISOString(),
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      presenceChannel.unsubscribe();
      telemetryChannel.unsubscribe();
      telemetryChannelRef.current = null;
      telemetryReadyRef.current = false;
      lastBroadcastRef.current = null;
    };
  }, [sessionSlug, operatorId, username]);

  // Update presence when username changes
  useEffect(() => {
    if (channel && channel.state === "joined") {
      channel.track({
        username: username || operatorId,
        isTemporary: !username,
        online_at: new Date().toISOString(),
      });
    }
  }, [username, channel, operatorId]);

  return {
    presenceUsers,
    operatorId,
    activeOperatorsCount: presenceUsers.length,
    channel,
  };
};
