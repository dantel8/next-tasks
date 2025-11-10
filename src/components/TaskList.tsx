"use client";

import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { Plus, Search, NotebookText } from "lucide-react";
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
      <div className="flex max-md:flex-col justify-between items-center mb-4 relative">
        <h1 className="text-white font-bold text-3xl md:text-[40px]">My Tasks - <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0A6AF7] via-[#DE78FF] to-[#DE78FF] font-black">forIT</span></h1>
        <Button
          label="New Task"
          icon={<Plus size={18} />}
          onClick={() => setShowForm(true)}
          severity="success"
          className="!bg-linear-to-r from-[#0A6AF7] to-[#DE78FF] !border-0 max-md:!fixed max-md:bottom-10 max-md:right-5 max-md:!rounded-full max-md:!w-14 max-md:!h-14 max-md:!p-0 max-md:items-center max-md:justify-center"
          pt={{
            label: { className: "max-md:hidden" }
          }}
        />
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 relative">
          <Search size={20} className="absolute left-3 !text-gray-400" />
          <InputText
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 !pl-10 !rounded-3xl"
          />
        </div>

        <SelectButton
          value={filter}
          onChange={(e) => setFilter(e.value)}
          options={filterOptions}
          className="w-full"
          pt={
            {
                root:{className:"flex gap-2"},
                button:{className:"!rounded-3xl max-md:!px-3 max-md:!py-1.5"}
            }
          }
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
        <div className=" flex flex-col items-center gap-3 text-center py-12 bg-white/10 rounded-2xl text-gray-400">
          <p className="text-lg">No tasks found</p>
          <NotebookText className="size-18" />
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
