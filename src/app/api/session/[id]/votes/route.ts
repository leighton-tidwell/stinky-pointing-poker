import { NextResponse } from "next/server";
import { getVotesBySessionId } from "@/schema/vote";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const votes = await getVotesBySessionId(params.id);

  return NextResponse.json(votes);
}
