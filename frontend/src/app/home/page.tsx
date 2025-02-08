"use client";

import { useState } from "react";
import { AddProjectDialog } from "./(components)/AddProjectDialog";
import { ProjectCard } from "./(components)/ProjectCard";

interface Project {
  id: number;
  title: string;
  description: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  const handleAddProject = (title: string, description: string) => {
    const newProject = {
      id: Date.now(),
      title,
      description,
    };
    setProjects([...projects, newProject]);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
          />
        ))}
      </div>
      <AddProjectDialog onProjectAdd={handleAddProject} />
    </div>
  );
}
