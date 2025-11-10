import Database from "better-sqlite3";
import path from "path";

const DB_FILE = process.env.DATABASE_FILE || path.resolve(process.cwd(), "data.db");

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    db = new Database(DB_FILE);
    
    // Initialize table
    db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return db;
}

export type Task = {
  id?: number;
  title: string;
  description?: string | null;
  completed?: 0 | 1 | boolean;
  created_at?: string;
};

export function getAllTasks(): Task[] {
  const db = getDb();
  const rows = db.prepare(`SELECT * FROM tasks ORDER BY created_at DESC`).all() as Task[];
  return rows.map((r) => ({
    ...r,
    completed: r.completed ? 1 : 0,
  }));
}

export function getTask(id: number): Task | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id) as Task | undefined;
  return row || null;
}

export function createTask(task: Task): Task {
  const db = getDb();
  const stmt = db.prepare(`INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)`);
  const result = stmt.run(
    task.title,
    task.description || null,
    task.completed ? 1 : 0,
  );
  return { id: Number(result.lastInsertRowid), ...task };
}

export function updateTask(id: number, patch: Partial<Task>): Task | null {
  const db = getDb();
  const existing = getTask(id);
  if (!existing) return null;
  const updated = {
    title: patch.title ?? existing.title,
    description: patch.description ?? existing.description,
    completed: typeof patch.completed === "boolean" ? (patch.completed ? 1 : 0) : (patch.completed ?? existing.completed),
  };
  const stmt = db.prepare(`UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?`);
  stmt.run(
    updated.title,
    updated.description,
    updated.completed ? 1 : 0,
    id,
  );
  return getTask(id);
}

export function deleteTask(id: number): boolean {
  const db = getDb();
  const stmt = db.prepare(`DELETE FROM tasks WHERE id = ?`);
  const res = stmt.run(id);
  return res.changes > 0;
}
