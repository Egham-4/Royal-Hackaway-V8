"use client";

import { BarChart3, LineChart, PieChart } from "lucide-react";
import { MetricCard } from "../(components)/MetricCard";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
];

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col gap-6 p-8">
          {/* Rest of your existing content */}
          {/* Header Section */}
          <header className="space-y-4">
            <h1 className="text-4xl font-bold">
              Dataset Analytics {/*#{params.id}*/}
            </h1>
            <p className="text-muted-foreground">
              Deep dive into your data insights
            </p>
          </header>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard title="Total Records" value="1,234" icon={BarChart3} />
            <MetricCard title="Total Charts" value="4" icon={LineChart} />
            <MetricCard title="Categories" value="8" icon={PieChart} />
          </div>

          {/* Data Table */}
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Detailed Records</h3>
            {/* Add your data table component here */}
            <Button className="flex-1" variant="outline">
              View Uploaded Dataset
            </Button>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-lg h-[400px]">
              <h3 className="text-xl font-semibold mb-4">Chart 1</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 bg-card rounded-lg h-[400px]">
              <h3 className="text-xl font-semibold mb-4">Chart 2</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
