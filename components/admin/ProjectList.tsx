"use client";

import type { Project } from "@/lib/types";
import Image from "next/image";

interface ProjectListProps {
  projects: Project[];
  editingId: string | null;
  onEdit: (project: Project) => void;
  onAddNew: () => void;
  onRefresh: () => void;
  onToast: (message: string, tone: "success" | "error") => void;
}

export function ProjectList({
  projects,
  editingId,
  onEdit,
  onAddNew,
  onRefresh,
  onToast,
}: ProjectListProps) {
  async function onDelete(project: Project) {
    if (
      !confirm(
        `Delete "${project.title}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    if (!res.ok) {
      onToast("Could not delete project.", "error");
      return;
    }
    onToast("Project deleted.", "success");
    onRefresh();
  }

  async function togglePublished(project: Project) {
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !project.published }),
    });
    if (!res.ok) {
      onToast("Could not update visibility.", "error");
      return;
    }
    onToast(
      project.published ? "Project hidden from site." : "Project is now live.",
      "success",
    );
    onRefresh();
  }

  const sorted = [...projects].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.id.localeCompare(b.id);
  });

  async function move(project: Project, direction: -1 | 1) {
    const newPosition = project.order + direction;
    if (newPosition < 1 || newPosition > sorted.length) return;
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newPosition }),
    });
    if (!res.ok) {
      onToast("Could not reorder.", "error");
      return;
    }
    onRefresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Your projects</h2>
          <p className="text-sm text-zinc-500">
            {sorted.length} project{sorted.length === 1 ? "" : "s"}. Order matches
            the public portfolio (1 = first).
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNew}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"
        >
          + Add project
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950/50 px-6 py-12 text-center">
          <p className="text-zinc-400">No projects yet.</p>
          <button
            type="button"
            onClick={onAddNew}
            className="mt-4 text-sm font-medium text-brand hover:underline"
          >
            Add your first project
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {sorted.map((p, index) => (
            <li
              key={p.id}
              className={`overflow-hidden rounded-2xl border bg-zinc-950 transition ${
                editingId === p.id
                  ? "border-brand ring-1 ring-brand/50"
                  : "border-white/10"
              }`}
            >
              <div className="relative aspect-video bg-zinc-900">
                <Image
                  src={p.thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
                <span
                  className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur"
                >
                  #{p.order}
                </span>
                <span
                  className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    p.published
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-200"
                  }`}
                >
                  {p.published ? "Live" : "Draft"}
                </span>
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="font-semibold text-white">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                    {p.description}
                  </p>
                </div>
                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(p, -1)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:border-white/20 disabled:opacity-30"
                    title="Move earlier on portfolio"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === sorted.length - 1}
                    onClick={() => move(p, 1)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:border-white/20 disabled:opacity-30"
                    title="Move later on portfolio"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublished(p)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:border-white/20"
                  >
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p)}
                    className="rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
