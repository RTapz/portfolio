import { readFile, writeFile } from "fs/promises";
import path from "path";
import { put, list, del } from "@vercel/blob";
import type { Project } from "./types";
import {
  compareProjects,
  sortProjects,
} from "./projectOrder";
import { assertCanPersistToDisk, hasBlobStorage } from "./persistStorage";

export { compareProjects, sortProjects } from "./projectOrder";

const DATA_PATH = path.join(process.cwd(), "data", "projects.json");
const BLOB_PATHNAME = "projects.json";

async function readFromFile(): Promise<Project[]> {
  const raw = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Project[];
}

async function writeToFile(projects: Project[]): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(projects, null, 2), "utf-8");
}

async function readFromBlob(): Promise<Project[]> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
  const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME);
  if (!blob) {
    return readFromFile();
  }
  const res = await fetch(blob.url);
  if (!res.ok) {
    throw new Error("Failed to read projects from blob storage");
  }
  return (await res.json()) as Project[];
}

async function writeToBlob(projects: Project[]): Promise<void> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
  const existing = blobs.find((b) => b.pathname === BLOB_PATHNAME);
  if (existing) {
    await del(existing.url);
  }
  await put(BLOB_PATHNAME, JSON.stringify(projects, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function readAll(): Promise<Project[]> {
  if (hasBlobStorage()) {
    return readFromBlob();
  }
  return readFromFile();
}

/** Assign contiguous positions 1…n without changing relative order. */
function renumberProjects(projects: Project[]): Project[] {
  return sortProjects(projects).map((p, i) => ({ ...p, order: i + 1 }));
}

function insertAtPosition(
  projects: Project[],
  project: Project,
  position: number,
): Project[] {
  const sorted = sortProjects(projects);
  const insertAt = Math.max(0, Math.min(position - 1, sorted.length));
  sorted.splice(insertAt, 0, project);
  return renumberProjects(sorted);
}

function moveToPosition(
  projects: Project[],
  id: string,
  position: number,
): Project[] {
  const sorted = sortProjects(projects);
  const idx = sorted.findIndex((p) => p.id === id);
  if (idx === -1) return renumberProjects(projects);
  const [item] = sorted.splice(idx, 1);
  const insertAt = Math.max(0, Math.min(position - 1, sorted.length));
  sorted.splice(insertAt, 0, item);
  return renumberProjects(sorted);
}

async function writeAll(projects: Project[]): Promise<void> {
  assertCanPersistToDisk();
  const normalized = renumberProjects(projects);
  if (hasBlobStorage()) {
    await writeToBlob(normalized);
    return;
  }
  await writeToFile(normalized);
}

export async function getPublishedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.published);
}

export async function getAllProjects(): Promise<Project[]> {
  return renumberProjects(await readAll());
}

export async function createProject(
  input: Omit<Project, "id">,
): Promise<Project> {
  const all = await readAll();
  const project: Project = {
    ...input,
    id: crypto.randomUUID(),
  };
  const position =
    input.order >= 1 ? Math.round(input.order) : all.length + 1;
  const next = insertAtPosition(all, project, position);
  await writeAll(next);
  return next.find((p) => p.id === project.id)!;
}

export async function updateProject(
  id: string,
  input: Partial<Omit<Project, "id">>,
): Promise<Project | null> {
  const all = await readAll();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const previous = all[index];
  const { order: desiredPosition, ...fields } = input;

  let list = all.map((p) =>
    p.id === id ? { ...previous, ...fields, id } : p,
  );

  if (typeof desiredPosition === "number") {
    const position = Math.max(
      1,
      Math.min(Math.round(desiredPosition), list.length),
    );
    list = moveToPosition(list, id, position);
  } else {
    list = renumberProjects(list);
  }

  await writeAll(list);
  return list.find((p) => p.id === id) ?? null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((p) => p.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}
