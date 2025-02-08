"use client";

import { useState } from "react";

import { ProjectCard } from "./(components)/ProjectCard";
import { AddProjectCard } from "./(components)/AddProjectCard";

/* Sidebar imports */
import { AppSidebar } from "@/components/app-sidebar";

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

export default function HomePage() {
  const initialProjects = [
    {
      id: 1,
      title: "Occupancy Rate Analysis",
      description:
        "Track and forecast room occupancy rates across seasons to optimize pricing and availability.",
    },
    {
      id: 2,
      title: "Guest Satisfaction Metrics",
      description:
        "Analyze guest reviews and feedback to identify key areas of improvement and maintain high service standards.",
    },
    {
      id: 3,
      title: "Revenue Per Room",
      description:
        "Monitor RevPAR trends and identify opportunities to maximize revenue through dynamic pricing strategies.",
    },
    {
      id: 4,
      title: "Booking Channel Performance",
      description:
        "Compare effectiveness of different booking platforms and optimize distribution channel strategy.",
    },
    {
      id: 5,
      title: "F&B Sales Analysis",
      description:
        "Track food and beverage sales patterns to optimize menu offerings and reduce waste.",
    },
  ];

  const [projects, setProjects] = useState<Project[]>(initialProjects);

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
              Home
            </h2>
            <p className="text-lg text-muted-foreground">
              Create and manage your data analysis projects
            </p>
          </header>

          {/* Cool Image Card */}
          <div className="w-full h-[420px] rounded-lg overflow-hidden shadow-lg">
            <img
              src="/images/home.png"
              alt="Analytics Dashboard"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AddProjectCard onAdd={handleAddProject} />
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
              />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
