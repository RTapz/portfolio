import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/contentStore";
import type { SiteContent } from "@/lib/types";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as SiteContent;
  await saveSiteContent(body);
  return NextResponse.json({ ok: true });
}
