export type BlobAccessLevel = "public" | "private";

/** Private matches default Vercel Blob stores; set BLOB_ACCESS=public only if the store allows it. */
export function blobAccessLevel(): BlobAccessLevel {
  return process.env.BLOB_ACCESS === "public" ? "public" : "private";
}

export function blobPutOptions() {
  return {
    access: blobAccessLevel(),
    addRandomSuffix: false,
    allowOverwrite: true,
  } as const;
}

export function blobGetOptions() {
  return {
    access: blobAccessLevel(),
    useCache: false,
  } as const;
}

/** URL stored in site content for uploaded files on a private blob store. */
export function mediaProxyUrl(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return `/api/media/${segments.map(encodeURIComponent).join("/")}`;
}

export function pickBlobPublicUrl(pathname: string, blobUrl: string): string {
  return blobAccessLevel() === "private" ? mediaProxyUrl(pathname) : blobUrl;
}
