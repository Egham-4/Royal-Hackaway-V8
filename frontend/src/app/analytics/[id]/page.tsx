"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Shadcn components
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // Recharts components
import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const params = useParams();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDataset = async () => {
      const { data, error } = await supabase
        .from("datasets") // Replace with your table name
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching dataset:", error);
      } else if (data) {
        // Transform the data for the chart
        const transformedData = data.data.map((row: any) => ({
          // Replace 'date' and 'value' with your actual CSV column names
          date: row.date, // Assuming 'date' is a column in your CSV
          value: row.value, // Assuming 'value' is a column in your CSV
        }));

        setChartData(transformedData);
      }
    };

    fetchDataset();
  }, [params.id]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
