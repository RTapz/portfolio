"use client";

import type { Project } from "@/lib/types";
import { sortProjects, stepProjectInList } from "@/lib/projectOrder";
import { notifyProjectsChanged } from "@/lib/projectsSync";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

interface ProjectListProps {
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
  editingId: string | null;
  onEdit: (project: Project) => void;
  onAddNew: () => void;
  onRefresh: () => void;
  onToast: (message: string, tone: "success" | "error") => void;
}

export function ProjectList({
  projects,
  onProjectsChange,
  editingId,
  onEdit,
  onAddNew,
  onRefresh,
  onToast,
}: ProjectListProps) {
  const [movingId, setMovingId] = useState<string | null>(null);

  const sorted = useMemo(() => sortProjects(projects), [projects]);

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
    notifyProjectsChanged();
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
    notifyProjectsChanged();
    onRefresh();
  }

  async function move(project: Project, direction: -1 | 1, currentIndex: number) {
    const optimistic = stepProjectInList(projects, project.id, direction);
    if (!optimistic) return;

    const newPosition =
      optimistic.find((p) => p.id === project.id)?.order ?? currentIndex + 1;

    onProjectsChange(optimistic);
    setMovingId(project.id);

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newPosition }),
      });
      if (!res.ok) {
        onToast("Could not save order. Reverting.", "error");
        onRefresh();
        return;
      }
      notifyProjectsChanged();
    } catch {
      onToast("Could not save order. Reverting.", "error");
      onRefresh();
    } finally {
      setMovingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Your projects</h2>
          <p className="text-sm text-zinc-500">
            {sorted.length} project{sorted.length === 1 ? "" : "s"}. Position{" "}
            <strong className="font-medium text-zinc-400">#1</strong> is the
            first card on your site (top-left in the row of 3). ↑ ↓ updates
            order instantly.
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
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sorted.map((p, index) => (
            <motion.li
              key={p.id}
              layout
              transition={{
                type: "spring",
                stiffness: 520,
                damping: 38,
                mass: 0.8,
              }}
              className={`overflow-hidden rounded-2xl border bg-zinc-950 transition-colors ${
                editingId === p.id
                  ? "border-brand ring-1 ring-brand/50"
                  : "border-white/10"
              } ${movingId === p.id ? "opacity-90" : ""}`}
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
                  #{index + 1}
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
                    disabled={index === 0 || movingId !== null}
                    onClick={() => move(p, -1, index)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:border-white/20 disabled:opacity-30"
                    title="Move one position earlier (e.g. #4 → #3)"
                  >
                    ↑ Up
                  </button>
                  <button
                    type="button"
                    disabled={index === sorted.length - 1 || movingId !== null}
                    onClick={() => move(p, 1, index)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:border-white/20 disabled:opacity-30"
                    title="Move one position later (e.g. #3 → #4)"
                  >
                    ↓ Down
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
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
