import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "../../../../lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  try {
    const body = await request.json();
    const updated = await updateTask(id, body);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error in PUT /api/tasks/:id:", error);
    return NextResponse.json({ 
      error: "Failed to update",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  try {
    const ok = await deleteTask(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/tasks/:id:", error);
    return NextResponse.json({ 
      error: "Failed to delete",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
