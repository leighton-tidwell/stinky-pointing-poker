import { NextResponse } from "next/server";
import { getSessionById } from "@/schema/session";

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const { id } = await props.params;
  const session = await getSessionById(Number(id));

  return NextResponse.json(session);
}
