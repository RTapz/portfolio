import { NextResponse } from "next/server";
import {
  isContactEmailConfigured,
  sendContactEmail,
} from "@/lib/contactEmail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

export async function POST(request: Request) {
  if (!isContactEmailConfigured()) {
    return NextResponse.json(
      {
        error:
          "Contact email is not configured on the server. Add RESEND_API_KEY.",
      },
      { status: 503 },
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 },
    );
  }

  if (
    name.length > MAX_NAME ||
    email.length > MAX_EMAIL ||
    message.length > MAX_MESSAGE
  ) {
    return NextResponse.json({ error: "Input is too long" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    await sendContactEmail({ name, email, message });
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
