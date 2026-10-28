import type { Project } from "./types";

/** Sort by display position (1 = leftmost / first). */
export function compareProjects(a: Project, b: Project): number {
  const orderA = Number(a.order);
  const orderB = Number(b.order);
  const orderDiff =
    (Number.isFinite(orderA) ? orderA : 0) -
    (Number.isFinite(orderB) ? orderB : 0);
  if (orderDiff !== 0) return orderDiff;
  return a.id.localeCompare(b.id);
}

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort(compareProjects);
}

/** Published projects in global display order (same order numbers as admin). */
export function sortPublishedProjects(projects: Project[]): Project[] {
  return sortProjects(projects.filter((p) => p.published));
}

/** 1-based portfolio slot after move by one step in the sorted list. */
export function positionAfterStep(
  currentIndex: number,
  direction: -1 | 1,
  total: number,
): number | null {
  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= total) return null;
  return nextIndex + 1;
}

/** Client/server: move one project to a 1-based slot and renumber 1…n. */
export function moveProjectInList(
  projects: Project[],
  id: string,
  targetPosition: number,
): Project[] {
  const sorted = sortProjects(projects);
  const idx = sorted.findIndex((p) => p.id === id);
  if (idx === -1) return projects;

  const position = Math.max(1, Math.min(Math.round(targetPosition), sorted.length));
  const [item] = sorted.splice(idx, 1);
  sorted.splice(position - 1, 0, item);
  return sorted.map((p, i) => ({ ...p, order: i + 1 }));
}

/** Swap one step in the sorted list (for ↑/↓). Returns null if invalid. */
export function stepProjectInList(
  projects: Project[],
  id: string,
  direction: -1 | 1,
): Project[] | null {
  const sorted = sortProjects(projects);
  const idx = sorted.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const newPosition = positionAfterStep(idx, direction, sorted.length);
  if (newPosition === null) return null;
  return moveProjectInList(projects, id, newPosition);
}
