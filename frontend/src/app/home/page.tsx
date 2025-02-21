"use client";

import { useEffect, useState } from "react";

import { ProjectCard } from "./(components)/ProjectCard";
import { AddProjectCard } from "./(components)/AddProjectCard";

/* Sidebar imports */
import { AppSidebar } from "@/components/app-sidebar";
import { supabase } from "@/lib/supabase";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";

interface Project {
  id: string; // UUID
  title: string;
  description: string;
  user_id: string; // UUID
}

interface User {
  id: string;
  email: string;
  created_at: string;
}

export default function HomePage() {
  const router = useRouter();

  // Sample Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  // Check if user is authenticated and fetch user details. Correct
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login"); // Redirect to login if not authenticated
      } else {
        setUser({
          id: user.id,
          email: user.email || "No email",
          created_at: user.created_at,
        });
        fetchProjects(user.id); // Fetch projects for the logged-in user
        fetchAllProjects();
      }
    };
    checkAuth();
  }, []);

  // Fetch projects for the logged-in user.
  const fetchProjects = async (userId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      console.log(userId);
      console.log("Fetched projects:", data); // Debugging log
      setProjects(data || []);
    }
    setIsLoading(false);
  };

  const fetchAllProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all projects:", error);
    } else {
      console.log("Fetched all projects:", data); // Debugging log
      setAllProjects(data || []); // Store all projects in a separate state
    }
    setIsLoading(false);
  };

  const handleAddProject = async (title: string, description: string) => {
    // To get the authenticated user.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to add a project.");
      return;
    }
    // Send a POST request to the projects table.
    const { data, error } = await supabase
      .from("projects")
      .insert([{ title, description, user_id: user.id }]) // insert new project in json format.
      .select(); // return the inserted row.

    if (error) {
      console.error("Error adding projects:", error);
    } else if (data) {
      // update the frontend state of projects.
      setProjects([data[0], ...projects]);
    }
  };

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

          {/* Display User Details */}
          {user && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold">User Details</h2>
              <div className="mt-2">
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Joined:</strong>{" "}
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

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
