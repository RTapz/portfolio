export const SERVICE_ICON_IDS = [
  "fullstack",
  "fintech",
  "ai",
  "documentation",
] as const;

export type ServiceIconId = (typeof SERVICE_ICON_IDS)[number];

export const SERVICE_ICON_LABELS: Record<ServiceIconId, string> = {
  fullstack: "Full-stack / web apps",
  fintech: "Fintech & payments",
  ai: "AI & automation",
  documentation: "Docs & architecture",
};

export function isServiceIconId(value: string): value is ServiceIconId {
  return (SERVICE_ICON_IDS as readonly string[]).includes(value);
}
