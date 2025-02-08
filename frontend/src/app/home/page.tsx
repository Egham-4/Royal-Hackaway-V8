"use client";

import { useState } from "react";
import { AddProjectDialog } from "./(components)/AddProjectDialog";
import { ProjectCard } from "./(components)/ProjectCard";

/* Sidebar imports */
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <header className="space-y-2 text-center sm:text-left">
            <div className="flex items-start justify-center text-center md:justify-start">
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-20">
                Welcome back, User!
              </h1>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Analytics Dashboard
            </h2>
            <p className="text-lg text-muted-foreground">
              Create and manage your data analysis projects
            </p>
          </header>

          {/* Image Card */}
          <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
            <img
              src="/images/home-card.png"
              alt="Analytics Dashboard"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Rest of your content */}
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
      </SidebarInset>
    </SidebarProvider>
  );
}
