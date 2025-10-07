import { NextResponse } from "next/server";
import { getSessionBySlug } from "@/schema/session";

export async function GET(
  _request: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const session = await getSessionBySlug(slug);

  return NextResponse.json(session);
}
