import { NextResponse } from "next/server";
import { getAllTasks, createTask, Task } from "../../../lib/db";

export async function GET() {
  try {
    const tasks = getAllTasks();
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: "Failed to get tasks" }, { status: 500 });
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
    const created = createTask(newTask);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
