"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreate: (project: { title: string; description: string }) => void;
};

export default function CreateProjectModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title) return;

    onCreate({ title, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">Create Project</h2>

        <input
          placeholder="Project title"
          className="w-full mb-3 p-2 rounded bg-gray-800"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full mb-4 p-2 rounded bg-gray-800"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-700 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-600 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}