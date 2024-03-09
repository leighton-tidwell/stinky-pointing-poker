import { NextResponse } from "next/server";
import { getSessionById } from "@/schema/session";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSessionById(Number(params.id));

  return NextResponse.json(session);
}
