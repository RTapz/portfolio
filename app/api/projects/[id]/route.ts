import { NextResponse } from "next/server";
import { deleteProject, updateProject } from "@/lib/projectStore";
import { storageErrorResponse } from "@/lib/persistStorage";
import { revalidatePublicSite } from "@/lib/revalidateSite";
import type { Project } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<Omit<Project, "id">>;
    const updated = await updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidatePublicSite();
    return NextResponse.json(updated);
  } catch (error) {
    const { status, body } = storageErrorResponse(error);
    console.error("[projects] PATCH failed", error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const ok = await deleteProject(id);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { status, body } = storageErrorResponse(error);
    console.error("[projects] DELETE failed", error);
    return NextResponse.json(body, { status });
  }
}
