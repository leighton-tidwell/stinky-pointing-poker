import { SessionContainer } from "@/components/session-container";
import { getSessionById } from "@/schema/session";
import { getVotesBySessionId } from "@/schema/vote";
import { redirect } from "next/navigation";

export default async function SessionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSessionById(Number(params.id));
  const votes = await getVotesBySessionId(params.id);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Session {session.id}</h1>
      <SessionContainer initialSession={session} initialVotes={votes} />
    </div>
  );
}
