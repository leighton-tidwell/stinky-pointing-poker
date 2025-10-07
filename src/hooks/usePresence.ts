"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type PresenceUser = {
  userId: string;
  username: string;
  isTemporary: boolean;
};

const generateOperatorId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `Operator-${randomNum}`;
};

export const usePresence = (sessionId: string, username: string) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);
  const [operatorId] = useState(() => generateOperatorId());

  useEffect(() => {
    const channelName = `session:${sessionId}`;
    const presenceChannel = supabase.channel(channelName, {
      config: { presence: { key: operatorId } },
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
    };
  }, [sessionId, operatorId, username]);

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
  };
};
