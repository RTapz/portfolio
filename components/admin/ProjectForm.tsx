"use client";

import { AdminField } from "@/components/admin/AdminField";
import { slugify } from "@/lib/slugify";
import { notifyProjectsChanged } from "@/lib/projectsSync";
import { readApiError } from "@/lib/adminApiError";
import type { Project } from "@/lib/types";
import { useEffect, useId, useState } from "react";
import { FileUploadField } from "./FileUploadField";

const empty: Omit<Project, "id"> = {
  title: "",
  slug: "",
  description: "",
  tags: [],
  thumbnailUrl: "/placeholder-project.svg",
  liveUrl: "",
  repoUrl: "",
  published: true,
  order: 1,
};

interface ProjectFormProps {
  initial?: Project;
  totalProjects: number;
  onSaved: () => void;
  onCancel: () => void;
  onToast: (message: string, tone: "success" | "error") => void;
}

function projectToForm(p: Project): Omit<Project, "id"> {
  return {
    title: p.title,
    slug: p.slug,
    description: p.description,
    tags: p.tags,
    thumbnailUrl: p.thumbnailUrl,
    liveUrl: p.liveUrl ?? "",
    repoUrl: p.repoUrl ?? "",
    published: p.published,
    order: p.order,
  };
}

export function ProjectForm({
  initial,
  totalProjects,
  onSaved,
  onCancel,
  onToast,
}: ProjectFormProps) {
  const defaultPosition = initial ? initial.order : totalProjects + 1;
  const maxPosition = initial ? totalProjects : totalProjects + 1;

  const formId = useId();
  const [form, setForm] = useState<Omit<Project, "id">>(
    initial ? projectToForm(initial) : { ...empty, order: defaultPosition },
  );
  const [tagsText, setTagsText] = useState(
    initial ? initial.tags.join(", ") : "",
  );
  const [slugManual, setSlugManual] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm(projectToForm(initial));
      setTagsText(initial.tags.join(", "));
      setSlugManual(true);
    } else {
      setForm({ ...empty, order: totalProjects + 1 });
      setTagsText("");
      setSlugManual(false);
    }
  }, [initial, totalProjects]);

  function updateTitle(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: !slugManual && !initial ? slugify(title) : f.slug,
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      liveUrl: form.liveUrl || undefined,
      repoUrl: form.repoUrl || undefined,
    };
    try {
      const url = initial ? `/api/projects/${initial.id}` : "/api/projects";
      const method = initial ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(await readApiError(res));
      }
      notifyProjectsChanged();
      onToast(
        initial ? "Project updated." : "Project added to your portfolio.",
        "success",
      );
      onSaved();
    } catch (err) {
      onToast(
        err instanceof Error ? err.message : "Could not save. Try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-white/10 bg-zinc-950 p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {initial ? `Editing: ${initial.title}` : "New project"}
          </h2>
          <p className="text-sm text-zinc-500">
            Fill in the details visitors see on your Portfolio section.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-white/5 bg-black/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Basics
        </p>
        <AdminField label="Project title" hint="Shown as the card heading.">
          <input
            className="field"
            value={form.title}
            onChange={(e) => updateTitle(e.target.value)}
            placeholder="e.g. HOPSA Marketplace"
            required
          />
        </AdminField>
        <AdminField
          label="Short description"
          hint="One or two sentences about what you built."
        >
          <textarea
            className="field min-h-[100px]"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="What does this project do?"
            required
          />
        </AdminField>
        <AdminField
          label="Tags"
          hint="Separate with commas. Shown as small labels on the card."
        >
          <input
            className="field"
            placeholder="React, TypeScript, Next.js"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </AdminField>
      </div>

      <div className="space-y-4 rounded-xl border border-white/5 bg-black/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Image & links
        </p>
        <FileUploadField
          label="Thumbnail image"
          kind="thumbnail"
          value={form.thumbnailUrl}
          onChange={(url) => setForm({ ...form, thumbnailUrl: url })}
          hint="Upload a screenshot or click Upload file."
        />
        <AdminField label="Live demo URL" hint="Optional. Shows a Live link.">
          <input
            className="field"
            type="url"
            placeholder="https://your-project.com"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
          />
        </AdminField>
        <AdminField label="GitHub / repo URL" hint="Optional. Shows a Code link.">
          <input
            className="field"
            type="url"
            placeholder="https://github.com/you/repo"
            value={form.repoUrl}
            onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
          />
        </AdminField>
      </div>

      <div className="space-y-4 rounded-xl border border-white/5 bg-black/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Visibility
        </p>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-black/40 p-4">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.published}
            onChange={(e) =>
              setForm({ ...form, published: e.target.checked })
            }
          />
          <span>
            <span className="block text-sm font-medium text-white">
              Show on my portfolio
            </span>
            <span className="block text-xs text-zinc-500">
              Turn off to keep this as a draft only you can see in admin.
            </span>
          </span>
        </label>
        <AdminField
          label="Position on portfolio"
          hint="Matches the public grid: 1 = top-left, then left to right in rows of 3. Saving moves this project to that slot."
        >
          <select
            className="field max-w-[200px]"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: Number(e.target.value) || 1 })
            }
          >
            {Array.from({ length: maxPosition }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
                {n === 1 ? " — first" : n === maxPosition ? " — last" : ""}
              </option>
            ))}
          </select>
        </AdminField>
        <details className="text-sm text-zinc-500">
          <summary className="cursor-pointer text-zinc-400 hover:text-white">
            Advanced: URL slug
          </summary>
          <input
            className="field mt-2"
            value={form.slug}
            onChange={(e) => {
              setSlugManual(true);
              setForm({ ...form, slug: e.target.value });
            }}
            placeholder="auto-generated-from-title"
          />
        </details>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-brand px-8 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Saving…" : initial ? "Save changes" : "Add project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-zinc-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
