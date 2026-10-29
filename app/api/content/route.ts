import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/contentStore";
import { storageErrorResponse } from "@/lib/persistStorage";
import { revalidatePublicSite } from "@/lib/revalidateSite";
import type { SiteContent } from "@/lib/types";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as SiteContent;
    await saveSiteContent(body);
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { status, body } = storageErrorResponse(error);
    console.error("[content] PUT failed", error);
    return NextResponse.json(body, { status });
  }
}
