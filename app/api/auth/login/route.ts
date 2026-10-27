import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

function readAdminPassword(): string {
  const raw = process.env.ADMIN_PASSWORD;
  if (!raw || raw.trim() === "") {
    return "admin";
  }
  return raw.trim();
}

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const submitted = (body.password ?? "").trim();
  const adminPassword = readAdminPassword();

  if (!submitted || submitted !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  try {
    const session = await getSession();
    session.isLoggedIn = true;
    await session.save();
  } catch {
    return NextResponse.json(
      {
        error:
          "Session could not be created. Set SESSION_SECRET in .env.local to at least 32 characters and restart the dev server.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
