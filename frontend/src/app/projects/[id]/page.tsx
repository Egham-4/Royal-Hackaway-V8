"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FloatingActionButton } from "./(components)/FloatingActionButton";
import { DatasetCard } from "./(components)/DataSetCard";

interface Dataset {
  id: string;
  name: string;
  description: string;
  date: string;
  size: string;
}

export default function ProjectPage() {
  const params = useParams();
  const id = params.id;
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  const handleAddDataset = (
    title: string,
    description: string,
    file: File | null
  ) => {
    const newDataset: Dataset = {
      id: (datasets.length + 1).toString(),
      name: title,
      description: description,
      date: new Date().toISOString().split("T")[0],
      size: file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "0 MB",
    };

    setDatasets([...datasets, newDataset]);
  };

  const handleDeleteDataset = (id: string) => {
    setDatasets(datasets.filter((dataset) => dataset.id !== id));
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 relative">
          <header className="space-y-2 text-center sm:text-left">
            <div className="flex items-start justify-center text-center md:justify-start">
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-20">
                Project Analysis: #{id}
              </h1>
            </div>
            <div className="w-full h-[420px] rounded-lg overflow-hidden shadow-lg">
              <img
                src="/images/home.png"
                alt="Analytics Dashboard"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Data Insights
            </h2>
            <p className="text-lg text-muted-foreground">
              View and analyze your project metrics
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((dataset) => (
              <DatasetCard
                key={dataset.id}
                dataset={dataset}
                onDelete={handleDeleteDataset}
              />
            ))}
            <FloatingActionButton onSubmit={handleAddDataset} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
