"use client";

import { useState } from "react";
import ProjectCard from "@/components/layout/ProjectCard";
import CreateProjectModal from "@/components/CreateProjectModal";

type Project = {
  title: string;
  description: string;
};


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    { title: "AI Task Manager", description: "AI destekli görev yönetim sistemi" },
    { title: "TEKNOFEST Vision System", description: "Otonom araçlar için görüntü işleme" },
    { title: "Personal Portfolio", description: "Kişisel yazılım portfolyo sitesi" },
  ]);

  const [open, setOpen] = useState(false);

  const handleCreate = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          + Create Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
          />
        ))}
      </div>

      {open && (
        <CreateProjectModal
          onClose={() => setOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}