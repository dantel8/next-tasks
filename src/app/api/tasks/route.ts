import { NextResponse } from "next/server";
import { getAllTasks, createTask, Task } from "../../../lib/db";

export async function GET() {
  try {
    const tasks = await getAllTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error in GET /api/tasks:", error);
    return NextResponse.json({ 
      error: "Failed to get tasks",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }
    const newTask: Task = {
      title: String(body.title),
      description: body.description ?? null,
      completed: body.completed ? 1 : 0,
    };
    const created = await createTask(newTask);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/tasks:", error);
    return NextResponse.json({ 
      error: "Failed to create task",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
