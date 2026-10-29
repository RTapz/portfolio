export async function readApiError(
  res: Response,
  fallback = "Could not save. Try again.",
): Promise<string> {
  try {
    const json = (await res.json()) as { error?: string };
    if (json.error) return json.error;
  } catch {
    /* ignore */
  }
  if (res.status === 401) {
    return "Session expired. Sign in again at /admin.";
  }
  return fallback;
}
