"use server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const getSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { params: { eventsPerSecond: 10 } },
  });
};

const broadcastToChannel = async (
  sessionId: number,
  event: string,
  payload: any,
) => {
  const supabase = getSupabaseClient();
  const channelName = `session:${sessionId}:updates`;
  const channel = supabase.channel(channelName);

  try {
    // Subscribe to the channel first
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Subscription timeout")),
        5000,
      );

      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          clearTimeout(timeout);
          resolve();
        }
      });
    });

    // Now send the broadcast
    await channel.send({ type: "broadcast", event, payload });

    // Unsubscribe after sending
    await channel.unsubscribe();
  } catch (error) {
    console.error("Broadcast error:", error);
    // Don't throw - continue execution even if broadcast fails
  }
};

export const broadcastSessionUpdate = async (
  sessionId: number,
  updates: Record<string, any>,
) => {
  await broadcastToChannel(sessionId, "session-update", updates);
};

export const broadcastVoteCast = async (sessionId: number, vote: any) => {
  await broadcastToChannel(sessionId, "vote-cast", vote);
};

export const broadcastVotesCleared = async (sessionId: number) => {
  await broadcastToChannel(sessionId, "votes-cleared", {});
};
