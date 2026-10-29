/** Human-readable fix when admin saves fail on Vercel without Blob. */
export const BLOB_SETUP_MESSAGE =
  "Production saves need Vercel Blob: in the Vercel project, open Storage → create a Blob store → connect it to this app, then redeploy.";

export function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL);
}

/** Blob via read-write token (local) or store ID + OIDC on Vercel. */
export function hasBlobStorage(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return true;
  if (isVercelRuntime() && process.env.BLOB_STORE_ID?.trim()) return true;
  return false;
}

/** Throws before writing JSON on serverless when Blob is not configured. */
export function assertCanPersistToDisk(): void {
  if (isVercelRuntime() && !hasBlobStorage()) {
    throw new Error(BLOB_SETUP_MESSAGE);
  }
}

export function storageErrorResponse(error: unknown): {
  status: number;
  body: { error: string };
} {
  const message =
    error instanceof Error ? error.message : "Could not save changes.";

  if (message === BLOB_SETUP_MESSAGE) {
    return { status: 503, body: { error: message } };
  }

  if (message.includes("Unauthorized") || message.includes("401")) {
    return {
      status: 401,
      body: { error: "Session expired. Sign in again at /admin." },
    };
  }

  return { status: 500, body: { error: message } };
}
