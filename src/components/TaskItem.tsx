"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Trash2, Pencil } from "lucide-react";
import { Task } from "@/store/taskStore";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const isCompleted = task.completed === 1 || task.completed === true;

  return (
    <Card className="mb-3 !rounded-3xl !bg-white/90 backdrop-blur-sm shadow-md">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isCompleted}
          onChange={() => task.id && onToggle(task.id, !isCompleted)}
          className="mt-1"
        />
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${isCompleted ? "line-through text-gray-400" : ""}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mt-1 ${isCompleted ? "line-through text-gray-400" : "text-gray-600"}`}>
              {task.description}
            </p>
          )}
          {task.created_at && (
            <p className="text-xs text-gray-400 mt-2">
              {new Date(task.created_at).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            icon={<Pencil size={16} />}
            rounded
            text
            severity="info"
            onClick={() => onEdit(task)}
            tooltip="Edit"
            tooltipOptions={{ position: "top" }}
          />
          <Button
            icon={<Trash2 size={16} />}
            rounded
            text
            severity="danger"
            onClick={() => task.id && onDelete(task.id)}
            tooltip="Delete"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      </div>
    </Card>
  );
}
