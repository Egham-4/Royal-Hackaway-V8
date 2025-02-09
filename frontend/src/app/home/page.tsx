"use client";

import { useEffect, useState } from "react";

import { ProjectCard } from "./(components)/ProjectCard";
import { AddProjectCard } from "./(components)/AddProjectCard";
import { Button } from "@/components/ui/button";

/* Sidebar imports */
import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { buildApiUrl, fetch_auth, getUser, isAuthenticated, removeToken, User } from "../utils/auth";
import { useRouter } from "next/navigation";
import { headers } from "next/headers";

interface Project {
  id: number;
  title: string;
  description: string;
}

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([]);

  //const user: User = getUser()
  let projectUrl = buildApiUrl('/project')
  let getProjectsUrl = buildApiUrl('/projects')

  useEffect(() => {
    //if (!isAuthenticated()) {
    //  router.push('/login')
    //}
    //else {
    const fetchProjects = async () => {
      let response = await fetch_auth(getProjectsUrl, {
        method: 'GET'
      })
      console.log(response)
      setProjects(response)
    }
    fetchProjects()
    setLoading(false)
    //}
  }, [])



  const handleAddProject = async (title: string, description: string) => {
    const newProject = {
      id: Date.now(),
      title,
      description,
    };

    let response = await fetch_auth(projectUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newProject)
    })
    console.log(response)

    setProjects([...projects, newProject]);
  };

  if (loading) return <h1>Loading</h1>

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <header className="space-y-2 text-center sm:text-left">
            <div className="flex items-start justify-center text-center md:justify-start">
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-20">
                Welcome back, Jack Ma!
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
          <div className="flex flex-wrap gap-6 justify-start">
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
