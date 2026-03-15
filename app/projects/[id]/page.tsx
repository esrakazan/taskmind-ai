"use client";

import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

type Task = {
  id: number;
  title: string;
  status: "todo" | "progress" | "done";
};

type Props = {
  params: {
    id: string;
  };
};

/* DRAGGABLE CARD */
function TaskCard({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      className="bg-gray-800 p-3 rounded mb-2 flex justify-between items-center"
    >
      {/* Drag handle */}
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className="cursor-grab flex-1"
      >
        {task.title}
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="ml-3 text-red-400 hover:text-red-300 text-sm"
      >
        ✕
      </button>
    </div>
  );
}

/* COLUMN */
function Column({
  id,
  title,
  tasks,
  onDelete,
}: {
  id: string;
  title: string;
  tasks: Task[];
  onDelete: (id: number) => void;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef}>
      <h2 className="mb-3 font-semibold">{title}</h2>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default function ProjectPage({ params }: Props) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Design UI", status: "todo" },
    { id: 2, title: "Build Navbar", status: "progress" },
    { id: 3, title: "Deploy project", status: "done" },
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newTask,
        status: "todo",
      },
    ]);

    setNewTask("");
  };

  const deleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id ? { ...task, status: over.id } : task
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Project: {params.id}</h1>

      {/* ADD TASK */}
      <div className="flex gap-2 mb-6">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
          className="bg-gray-800 p-2 rounded w-64"
        />

        <button
          onClick={addTask}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          Add Task
        </button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          <Column
            id="todo"
            title="Todo"
            tasks={tasks.filter((t) => t.status === "todo")}
            onDelete={deleteTask}
          />

          <Column
            id="progress"
            title="In Progress"
            tasks={tasks.filter((t) => t.status === "progress")}
            onDelete={deleteTask}
          />

          <Column
            id="done"
            title="Done"
            tasks={tasks.filter((t) => t.status === "done")}
            onDelete={deleteTask}
          />
        </div>
      </DndContext>
    </div>
  );
}