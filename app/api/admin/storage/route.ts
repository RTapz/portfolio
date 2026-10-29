import { NextResponse } from "next/server";
import {
  BLOB_SETUP_MESSAGE,
  hasBlobStorage,
  isVercelRuntime,
} from "@/lib/persistStorage";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const vercel = isVercelRuntime();
  const blobConfigured = hasBlobStorage();
  const canPersist = blobConfigured || !vercel;

  return NextResponse.json({
    canPersist,
    vercel,
    blobConfigured,
    message:
      vercel && !blobConfigured ? BLOB_SETUP_MESSAGE : null,
  });
}
