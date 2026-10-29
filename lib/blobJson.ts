import { get } from "@vercel/blob";
import { blobGetOptions } from "./blobAccess";

export async function readJsonFromBlobPathname<T>(pathname: string): Promise<T> {
  const result = await get(pathname, blobGetOptions());
  if (!result?.stream) {
    throw new Error(`Failed to read blob: ${pathname}`);
  }
  const raw = await new Response(result.stream).text();
  return JSON.parse(raw) as T;
}
