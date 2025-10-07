import { SessionContainer } from "@/components/session-container";
import { getSessionById } from "@/schema/session";
import { getVotesBySessionId } from "@/schema/vote";
import { redirect } from "next/navigation";

export default async function SessionPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await getSessionById(Number(id));
  const votes = await getVotesBySessionId(id);

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
