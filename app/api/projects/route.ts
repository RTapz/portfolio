import { NextResponse } from "next/server";
import {
  createProject,
  getAllProjects,
  getPublishedProjects,
} from "@/lib/projectStore";
import { getSession } from "@/lib/session";
import type { Project } from "@/lib/types";

export async function GET() {
  const session = await getSession();
  const projects = session.isLoggedIn
    ? await getAllProjects()
    : await getPublishedProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<Project, "id">;
  const project = await createProject(body);
  return NextResponse.json(project, { status: 201 });
}
