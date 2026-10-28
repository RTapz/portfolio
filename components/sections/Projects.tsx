"use client";

import type { Project } from "@/lib/types";
import { sortProjects } from "@/lib/projectOrder";
import { subscribeProjectsChanged } from "@/lib/projectsSync";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ProjectsProps {
  projects: Project[];
}

async function fetchPublishedProjects(): Promise<Project[]> {
  const res = await fetch(`/api/projects/public?_=${Date.now()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  return (await res.json()) as Project[];
}

function orderKey(list: Project[]): string {
  return sortProjects(list)
    .map((p) => `${p.id}:${p.order}`)
    .join("|");
}

export function Projects({ projects: initialProjects }: ProjectsProps) {
  const [projects, setProjects] = useState(initialProjects);
  const lastKey = useRef(orderKey(initialProjects));

  const applyProjects = useCallback((next: Project[]) => {
    const key = orderKey(next);
    if (key === lastKey.current) return;
    lastKey.current = key;
    setProjects(next);
  }, []);

  const syncFromServer = useCallback(async () => {
    const next = await fetchPublishedProjects();
    if (next.length > 0) {
      applyProjects(next);
    }
  }, [applyProjects]);

  useEffect(() => {
    applyProjects(initialProjects);
  }, [initialProjects, applyProjects]);

  useEffect(() => {
    void syncFromServer();
  }, [syncFromServer]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) void syncFromServer();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [syncFromServer]);

  useEffect(() => {
    return subscribeProjectsChanged(() => {
      void syncFromServer();
    });
  }, [syncFromServer]);

  const sorted = useMemo(() => sortProjects(projects), [projects]);

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Portfolio
          </h2>
          <p className="mt-2 max-w-xl text-zinc-400">
            Selected work and experiments from recent builds and collaborations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white">
            All
          </span>
          <span className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-zinc-500">
            Web
          </span>
          <span className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-zinc-500">
            Mobile
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {sorted.map((project, i) => (
          <motion.article
            key={project.id}
            layout
            layoutId={`portfolio-${project.id}`}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 38 }}
            className="group overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/80 transition hover:border-brand/40"
          >
            <div className="relative aspect-video overflow-hidden bg-zinc-900">
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-3 p-5">
              <h3 className="text-lg font-semibold text-white">
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 pt-1 text-sm font-medium">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    className="text-brand hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    className="text-zinc-400 hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
