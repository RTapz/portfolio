import { readFile, writeFile } from "fs/promises";
import path from "path";
import { del, list, put } from "@vercel/blob";
import { defaultSiteContent } from "@/lib/defaultSiteContent";
import { assertCanPersistToDisk, hasBlobStorage } from "@/lib/persistStorage";
import type { SiteContent } from "@/lib/types";

const DATA_PATH = path.join(process.cwd(), "data", "site-content.json");
const BLOB_PATHNAME = "site-content.json";

async function readFromFile(): Promise<SiteContent> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as SiteContent;
  } catch {
    return defaultSiteContent;
  }
}

async function writeToFile(content: SiteContent): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(content, null, 2), "utf-8");
}

async function readFromBlob(): Promise<SiteContent> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
  const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME);
  if (!blob) {
    return readFromFile();
  }
  const res = await fetch(blob.url);
  if (!res.ok) {
    throw new Error("Failed to read site content from blob storage");
  }
  return (await res.json()) as SiteContent;
}

async function writeToBlob(content: SiteContent): Promise<void> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
  const existing = blobs.find((b) => b.pathname === BLOB_PATHNAME);
  if (existing) {
    await del(existing.url);
  }
  await put(BLOB_PATHNAME, JSON.stringify(content, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function getSiteContent(): Promise<SiteContent> {
  if (hasBlobStorage()) {
    return readFromBlob();
  }
  return readFromFile();
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  assertCanPersistToDisk();
  if (hasBlobStorage()) {
    await writeToBlob(content);
    return;
  }
  await writeToFile(content);
}
