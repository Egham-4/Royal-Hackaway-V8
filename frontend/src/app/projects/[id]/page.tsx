"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FloatingActionButton } from "./(components)/FloatingActionButton";
import { DatasetCard } from "./(components)/DataSetCard";
import { buildApiUrl, fetch_auth } from "@/app/utils/auth";

interface Dataset {
  id: string;
  name: string;
  description: string;
  date: string;
  size: string;
}

//const datasets: Dataset[] = [
//  {
//    id: "1",
//    name: "Sales Data 2023",
//    description: "Annual sales performance data",
//    date: "2023-12-01",
//    size: "2.5 MB",
//  },
//  {
//    id: "2",
//    name: "Customer Feedback",
//    description: "Customer survey response",
//    date: "2023-11-15",
//    size: "1.8 MB",
//  },
//];
export default function ProjectPage() {
  const params = useParams();
  const id = params.id;
  const [datasets, setDataset] = useState([])
  const [loading, setLoading] = useState(true)

  let getDataUrl = buildApiUrl('/getdata/' + id?.toString())

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch_auth(getDataUrl, {
        method: 'GET'
      })
      console.log(response)
      setDataset(response)
    }
    fetchData()
    setLoading(false)
    //}
  }, [])

  const handleAddDataset = (
    title: string,
    description: string,
    file: File | null
  ) => {
    // Handle dataset addition logic here
  };

  const handleDeleteDataset = (id: string) => {
    // Handle dataset deletion logic here
  };

  if (loading) return <h1>Loading..</h1>

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
            {/* Cool Image Card */}
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
                dataset={dataset}
                onDelete={handleDeleteDataset}
              />
            ))}

            <FloatingActionButton onSubmit={handleAddDataset} project_id={id} />
          </div>
          <div></div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
