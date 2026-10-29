import { get } from "@vercel/blob";
import { blobGetOptions } from "@/lib/blobAccess";

type Params = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, { params }: Params) {
  const { path } = await params;
  if (!path?.length) {
    return new Response("Not found", { status: 404 });
  }

  const pathname = path.map((segment) => decodeURIComponent(segment)).join("/");

  try {
    const result = await get(pathname, blobGetOptions());
    if (!result?.stream) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
