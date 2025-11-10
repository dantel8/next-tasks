"use client";

import { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Task, useTaskStore } from "@/store/taskStore";
import { Save, X } from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

export default function TaskForm({ task, onClose }: TaskFormProps) {
  const { addTask, updateTask } = useTaskStore();
  const isEditing = !!task?.id;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (isEditing && task.id) {
        await updateTask(task.id, data);
      } else {
        await addTask(data);
      }
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <Dialog
      header={isEditing ? "Edit Task" : "New Task"}
      visible={true}
      style={{ width: "500px" }}
      onHide={onClose}
      modal
      draggable={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-semibold">
            Title <span className="text-red-500">*</span>
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputText
                id="title"
                {...field}
                placeholder="Enter task title"
                className={errors.title ? "p-invalid" : ""}
              />
            )}
          />
          {errors.title && (
            <small className="text-red-500">{errors.title.message}</small>
          )}
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-semibold">
            Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <InputTextarea
                id="description"
                {...field}
                rows={4}
                placeholder="Enter task description (optional)"
                className={errors.description ? "p-invalid" : ""}
              />
            )}
          />
          {errors.description && (
            <small className="text-red-500">{errors.description.message}</small>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            label="Cancel"
            icon={<X size={16} />}
            severity="secondary"
            onClick={onClose}
            outlined
          />
          <Button
            type="submit"
            label={isEditing ? "Update" : "Create"}
            icon={<Save size={16} />}
            severity="success"
            loading={isSubmitting}
          />
        </div>
      </form>
    </Dialog>
  );
}
