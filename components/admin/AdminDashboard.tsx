"use client";

import type { Project } from "@/lib/types";
import type { SiteContent } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { AdminToast } from "./AdminToast";
import { ProjectForm } from "./ProjectForm";
import { ProjectList } from "./ProjectList";
import { SiteContentEditor } from "./SiteContentEditor";

export function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [section, setSection] = useState<"site" | "projects">("site");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "error" | "info";
  } | null>(null);
  const showToast = useCallback(
    (message: string, tone: "success" | "error" | "info" = "info") => {
      setToast({ message, tone });
      window.setTimeout(() => setToast(null), 5000);
    },
    [],
  );

  const loadProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    setProjects(await res.json());
  }, []);

  const loadContent = useCallback(async () => {
    const res = await fetch("/api/content");
    setSiteContent(await res.json());
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadProjects(), loadContent()]);
      setLoading(false);
    })();
  }, [loadProjects, loadContent]);

  function focusProjectForm() {
    window.scrollTo(0, 0);
  }

  function openNewProject() {
    setEditing(null);
    setShowProjectForm(true);
    focusProjectForm();
  }

  function openEditProject(project: Project) {
    setEditing(project);
    setShowProjectForm(true);
    focusProjectForm();
  }

  function closeProjectForm() {
    setEditing(null);
    setShowProjectForm(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio admin</h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-500">
            Update your site text, images, and projects. Changes appear on the
            public site after you save.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 hover:border-white/30 hover:text-white"
          >
            Preview site ↗
          </a>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            Log out
          </button>
        </div>
      </header>

      {toast && (
        <AdminToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => setToast(null)}
        />
      )}

      <nav
        className="flex gap-2 rounded-2xl border border-white/10 bg-zinc-950/80 p-1.5"
        aria-label="Admin sections"
      >
        <button
          type="button"
          onClick={() => setSection("site")}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            section === "site"
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Site content
        </button>
        <button
          type="button"
          onClick={() => setSection("projects")}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            section === "projects"
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Projects
        </button>
      </nav>

      {loading && (
        <p className="text-center text-sm text-zinc-500">Loading your content…</p>
      )}

      {!loading && section === "site" && siteContent && (
        <SiteContentEditor
          initial={siteContent}
          onSaved={loadContent}
          onToast={showToast}
        />
      )}

      {!loading && section === "projects" && (
        <div className="space-y-8">
          {showProjectForm && (
            <ProjectForm
              initial={editing ?? undefined}
              totalProjects={projects.length}
              onSaved={() => {
                closeProjectForm();
                loadProjects();
              }}
              onCancel={closeProjectForm}
              onToast={showToast}
            />
          )}

          <ProjectList
            projects={projects}
            editingId={editing?.id ?? null}
            onEdit={openEditProject}
            onAddNew={openNewProject}
            onRefresh={loadProjects}
            onToast={showToast}
          />
        </div>
      )}
    </div>
  );
}
