import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 },
    );
  }

  console.info("[contact]", {
    name: body.name,
    email: body.email,
    message: body.message.slice(0, 200),
  });

  return NextResponse.json({ ok: true, message: "Message received (placeholder)" });
}
