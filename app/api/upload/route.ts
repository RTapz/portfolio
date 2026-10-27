import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { getSession } from "@/lib/session";

const ALLOWED: Record<string, string[]> = {
  portrait: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"],
  thumbnail: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"],
  cv: [".pdf"],
};

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = String(formData.get("kind") ?? "thumbnail");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedExts = ALLOWED[kind] ?? ALLOWED.thumbnail;
  const ext = path.extname(file.name).toLowerCase();
  if (!allowedExts.includes(ext)) {
    return NextResponse.json(
      { error: `File type not allowed. Use: ${allowedExts.join(", ")}` },
      { status: 400 },
    );
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 8MB" }, { status: 400 });
  }

  const subdir = kind === "cv" ? "uploads/cv" : "uploads/images";
  const safeBase = file.name
    .replace(ext, "")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .slice(0, 40);
  const filename = `${Date.now()}-${safeBase || "file"}${ext}`;
  const publicPath = `/${subdir}/${filename}`;
  const diskPath = path.join(process.cwd(), "public", subdir, filename);

  await mkdir(path.dirname(diskPath), { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(diskPath, buffer);

  return NextResponse.json({ url: publicPath });
}
