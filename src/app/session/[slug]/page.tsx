import { SessionContainer } from "@/components/session-container";
import { getSessionBySlug } from "@/schema/session";
import { getVotesBySessionSlug } from "@/schema/vote";
import { redirect } from "next/navigation";

export default async function SessionPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const session = await getSessionBySlug(slug);
  const votes = await getVotesBySessionSlug(slug);

  if (!session) {
    redirect("/");
  }

  return <SessionContainer initialSession={session} initialVotes={votes} />;
}
