import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
import fs from "fs";
import path from "path";

const DB_FILE = process.env.DATABASE_FILE || path.resolve(process.cwd(), "data.db");

let db: SqlJsDatabase | null = null;
let initPromise: Promise<SqlJsDatabase> | null = null;

async function initDb(): Promise<SqlJsDatabase> {
  if (db) return db;
  
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const SQL = await initSqlJs({
      // Use the local wasm file from node_modules for server-side
      locateFile: (file: string) => {
        // In development and production on server, use node_modules path
        const wasmPath = path.join(
          process.cwd(),
          'node_modules',
          '.pnpm',
          'sql.js@1.13.0',
          'node_modules',
          'sql.js',
          'dist',
          file
        );
        return wasmPath;
      },
    });

    // Load existing database if it exists
    if (fs.existsSync(DB_FILE)) {
      const buffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }

    // Initialize table
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Save to disk
    const data = db.export();
    fs.writeFileSync(DB_FILE, data);

    return db;
  })();

  return initPromise;
}

function saveDb() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(DB_FILE, data);
  }
}

export type Task = {
  id?: number;
  title: string;
  description?: string | null;
  completed?: 0 | 1 | boolean;
  created_at?: string;
};

export async function getAllTasks(): Promise<Task[]> {
  const database = await initDb();
  const result = database.exec(`SELECT * FROM tasks ORDER BY created_at DESC`);
  
  if (result.length === 0) return [];
  
  const rows = result[0];
  return rows.values.map((row: unknown[]) => ({
    id: row[0] as number,
    title: row[1] as string,
    description: row[2] as string | null,
    completed: row[3] as 0 | 1,
    created_at: row[4] as string,
  }));
}

export async function getTask(id: number): Promise<Task | null> {
  const database = await initDb();
  const result = database.exec(`SELECT * FROM tasks WHERE id = ?`, [id]);
  
  if (result.length === 0 || result[0].values.length === 0) return null;
  
  const row = result[0].values[0];
  return {
    id: row[0] as number,
    title: row[1] as string,
    description: row[2] as string | null,
    completed: row[3] as 0 | 1,
    created_at: row[4] as string,
  };
}

export async function createTask(task: Task): Promise<Task> {
  const database = await initDb();
  database.run(
    `INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)`,
    [task.title, task.description || null, task.completed ? 1 : 0]
  );
  
  const result = database.exec(`SELECT last_insert_rowid() as id`);
  const id = result[0].values[0][0] as number;
  
  saveDb();
  
  return { id, ...task };
}

export async function updateTask(id: number, patch: Partial<Task>): Promise<Task | null> {
  const existing = await getTask(id);
  if (!existing) return null;

  const database = await initDb();
  const updated = {
    title: patch.title ?? existing.title,
    description: patch.description ?? existing.description,
    completed: typeof patch.completed === "boolean" ? (patch.completed ? 1 : 0) : (patch.completed ?? existing.completed),
  };

  database.run(
    `UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?`,
    [updated.title, updated.description || null, updated.completed ? 1 : 0, id]
  );

  saveDb();
  
  return getTask(id);
}

export async function deleteTask(id: number): Promise<boolean> {
  const database = await initDb();
  database.run(`DELETE FROM tasks WHERE id = ?`, [id]);
  
  saveDb();
  
  return true;
}
