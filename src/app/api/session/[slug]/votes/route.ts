import { NextResponse } from "next/server";
import { getVotesBySessionSlug } from "@/schema/vote";

export async function GET(
  _request: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const votes = await getVotesBySessionSlug(slug);

  return NextResponse.json(votes);
}
