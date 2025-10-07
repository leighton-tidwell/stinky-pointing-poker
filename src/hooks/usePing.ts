"use client";
import { useEffect, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const usePing = (channel: RealtimeChannel | null) => {
  const [ping, setPing] = useState<number | null>(null);
  const [isStable, setIsStable] = useState(true);

  useEffect(() => {
    if (!channel) return;

    let pingInterval: NodeJS.Timeout;
    let checkChannelInterval: NodeJS.Timeout;
    let pendingPing: number | null = null;
    let isSetup = false;

    // Listen for ping responses (broadcasts echo back to sender in Supabase)
    const handlePingResponse = (payload: any) => {
      if (
        payload.payload?.timestamp &&
        pendingPing !== null &&
        pendingPing === payload.payload.timestamp
      ) {
        const latency = Math.round(performance.now() - pendingPing);
        setPing(latency);
        // Consider connection unstable if ping > 500ms
        setIsStable(latency < 500);
        pendingPing = null;
      }
    };

    // Send ping messages every 5 seconds
    const sendPing = () => {
      if (pendingPing) {
        // Previous ping didn't respond - connection might be bad
        setPing(null);
        setIsStable(false);
      }

      const timestamp = performance.now();
      pendingPing = timestamp;

      channel.send({
        type: "broadcast",
        event: "ping",
        payload: { timestamp },
      });
    };

    const setupPing = () => {
      if (isSetup) return;
      isSetup = true;

      // Subscribe to ping responses
      channel.on("broadcast", { event: "ping" }, handlePingResponse);

      // Send initial ping immediately
      sendPing();
      // Then send pings every 5 seconds
      pingInterval = setInterval(sendPing, 5000);
    };

    // If channel is already joined, set up immediately
    if (channel.state === "joined") {
      setupPing();
    } else {
      // Wait for channel to be joined (it's already being subscribed in usePresence)
      // Poll for channel to be ready
      checkChannelInterval = setInterval(() => {
        if (channel.state === "joined" && !isSetup) {
          clearInterval(checkChannelInterval);
          setupPing();
        }
      }, 100);
    }

    return () => {
      if (pingInterval) clearInterval(pingInterval);
      if (checkChannelInterval) clearInterval(checkChannelInterval);
      // Note: We don't unsubscribe from the channel since it's managed by usePresence
    };
  }, [channel]);

  return { ping, isStable };
};
