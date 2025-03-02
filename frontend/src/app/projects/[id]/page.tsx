"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FloatingActionButton } from "./(components)/FloatingActionButton";
import { DatasetCard } from "./(components)/DataSetCard";
import * as Papa from "papaparse";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Dataset {
  id: string;
  name: string;
  description: string;
  date: string;
  size: string;
  data?: any; // Add this field to store the parsed CSV data
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();

  // Function to handle analyse button.
  const handleAnalyse = (id: string) => {
    const dataset = datasets.find((dataset) => dataset.id === id);
    console.log(dataset);
    if (dataset) {
      // Construct the URL with query parameters
      const queryParams = new URLSearchParams({
        data: JSON.stringify(dataset.data),
      }).toString();

      // Navigate to the analytics page with query parameters
      router.push(`/analytics/${id}?${queryParams}`);
    }
  };

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const handleAddDataset = async (
    title: string,
    description: string,
    file: File | null
  ) => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: async (results) => {
        const newDataset = {
          name: title,
          description: description,
          date: new Date().toISOString().split("T")[0],
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          data: results.data, // Store the parsed CSV data
        };
        // Save the dataset to Supabase
        const { data, error } = await supabase
          .from("datasets") // Replace with your table name
          .insert([newDataset])
          .select();

        if (error) {
          console.error("Error saving dataset:", error);
        } else {
          // Update the local state with the new dataset
          setDatasets([...datasets, ...data]);
        }
      },
    });
  };

  // To fetch datasets from "datasets" table in the database(supabase).
  useEffect(() => {
    const fetchDatasets = async () => {
      const { data, error } = await supabase
        .from("datasets") // Replace with your table name
        .select("*");

      if (error) {
        console.error("Error fetching datasets:", error);
      } else {
        setDatasets(data);
      }
    };

    fetchDatasets();
  }, []);

  // To delete dataset.
  const handleDeleteDataset = async (id: string) => {
    const { error } = await supabase
      .from("datasets") // Replace with your table name
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting dataset:", error);
    } else {
      // Update the local state
      setDatasets(datasets.filter((dataset) => dataset.id !== id));
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 relative">
          <header className="space-y-2 text-center sm:text-left">
            <div className="flex items-start justify-center text-center md:justify-start">
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-20">
                Project Analysis
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
                onAnalyse={handleAnalyse}
              />
            ))}
            <FloatingActionButton onSubmit={handleAddDataset} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
