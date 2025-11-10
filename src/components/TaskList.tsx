"use client";

import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { Plus, Search } from "lucide-react";
import TaskItem from "@/components/TaskItem";
import TaskForm from "@/components/TaskForm";
import { useTaskStore, Task } from "@/store/taskStore";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";

export default function TaskList() {
  const {
    loading,
    error,
    filter,
    searchQuery,
    fetchTasks,
    updateTask,
    deleteTask,
    setFilter,
    setSearchQuery,
    getFilteredTasks,
  } = useTaskStore();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleComplete = (id: number, completed: boolean) => {
    updateTask(id, { completed: completed ? 1 : 0 });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ];

  const filteredTasks = getFilteredTasks();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <Button
          label="New Task"
          icon={<Plus size={18} />}
          onClick={() => setShowForm(true)}
          severity="success"
        />
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2">
          <Search size={20} className="text-gray-400" />
          <InputText
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>

        <SelectButton
          value={filter}
          onChange={(e) => setFilter(e.value)}
          options={filterOptions}
          className="w-full"
        />
      </div>

      {/* Error Message */}
      {error && (
        <Message severity="error" text={error} className="mb-4 w-full" />
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center p-8">
          <ProgressSpinner />
        </div>
      )}

      {/* Task List */}
      {!loading && filteredTasks.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No tasks found</p>
          <p className="text-sm">Create your first task to get started!</p>
        </div>
      )}

      {!loading && filteredTasks.length > 0 && (
        <div>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Task Form Dialog */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
