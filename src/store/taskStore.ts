import { create } from "zustand";

export type Task = {
  id?: number;
  title: string;
  description?: string | null;
  completed?: 0 | 1 | boolean;
  created_at?: string;
};

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: "all" | "completed" | "pending";
  searchQuery: string;
  
  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id" | "created_at">) => Promise<void>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setFilter: (filter: "all" | "completed" | "pending") => void;
  setSearchQuery: (query: string) => void;
  
  // Computed
  getFilteredTasks: () => Task[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  filter: "all",
  searchQuery: "",

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const tasks = await res.json();
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addTask: async (task) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const newTask = await res.json();
      set((state) => ({ tasks: [newTask, ...state.tasks], loading: false }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateTask: async (id, task) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated = await res.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setFilter: (filter) => set({ filter }),
  
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  getFilteredTasks: () => {
    const { tasks, filter, searchQuery } = get();
    let filtered = tasks;

    // Apply filter
    if (filter === "completed") {
      filtered = filtered.filter((t) => t.completed);
    } else if (filter === "pending") {
      filtered = filtered.filter((t) => !t.completed);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  },
}));
