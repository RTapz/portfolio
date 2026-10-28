import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/projectStore";

/** Public portfolio grid — always published projects in admin order (no session). */
export async function GET() {
  const projects = await getPublishedProjects();
  return NextResponse.json(projects, {
    headers: {
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
