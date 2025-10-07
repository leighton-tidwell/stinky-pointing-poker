import { NextResponse } from "next/server";
import { getVotesBySessionId } from "@/schema/vote";

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const { id } = await props.params;
  const votes = await getVotesBySessionId(id);

  return NextResponse.json(votes);
}
