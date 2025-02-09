"use client";

import { BarChart3, LineChart, PieChart } from "lucide-react";
import { MetricCard } from "../(components)/MetricCard";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

import { Sparkles, LightbulbIcon } from "lucide-react";

// Add this sample data for the pie chart
const pieData = [
  { name: "Category A", value: 400 },
  { name: "Category B", value: 300 },
  { name: "Category C", value: 300 },
  { name: "Category D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
          {/* AI Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AI Summary Card */}
            <div className="bg-card rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">AI Summary</h3>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <p>Dataset shows strong positive growth trends over Q1 2024</p>
                <p>Peak performance observed in April with 800 units</p>
                <p>Category A leads distribution with 33% market share</p>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-card rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <LightbulbIcon className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">AI Insights</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • Consider increasing focus on Category B for growth potential
                </li>
                <li>
                  • February shows lowest performance - investigate seasonal
                  factors
                </li>
                <li>
                  • Strong recovery pattern identified from March to April
                </li>
              </ul>
            </div>
          </div>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1 - Line Chart */}
            <div className="p-6 bg-card rounded-lg h-[300px]">
              <h3 className="text-xl font-semibold mb-4">Line Chart</h3>
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

            {/* Chart 2 - Area Chart */}
            <div className="p-6 bg-card rounded-lg h-[300px]">
              <h3 className="text-xl font-semibold mb-4">Area Chart</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Chart 3 - Enhanced Pie Chart */}
            <div className="p-4 bg-card rounded-lg h-[300px]">
              <h3 className="text-xl font-semibold mb-2">
                Category Distribution
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} units`, name]}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 4 - Line Chart with Different Styling */}
            <div className="p-6 bg-card rounded-lg h-[300px]">
              <h3 className="text-xl font-semibold mb-4">Trend Analysis</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="natural"
                    dataKey="value"
                    stroke="#ff7300"
                    strokeWidth={2}
                    dot={{ stroke: "#ff7300", strokeWidth: 2, r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/*ends here*/}
          <Separator />
          {/* Next Steps Card */}
          <div className="bg-card rounded-lg p-6 w-full mt-8">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Recommended Next Steps</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Short Term</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Review February performance metrics</li>
                  <li>• Implement Category B optimization</li>
                  <li>• Set up automated monitoring</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Medium Term</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Develop Category C growth strategy</li>
                  <li>• Enhance data collection methods</li>
                  <li>• Create predictive models</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Long Term</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Scale successful strategies</li>
                  <li>• Expand into new categories</li>
                  <li>• Build automated reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
