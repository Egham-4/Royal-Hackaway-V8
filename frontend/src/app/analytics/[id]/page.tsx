"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabase";

interface ChartDataPoint {
  month: string;
  revenue: number;
}

interface DataRow {
  month: string | null;
  revenue?: number;
}

interface Dataset {
  id: string;
  name: string;
  description: string;
  date: string;
  size: string;
  data: DataRow[];
}

export default function AnalyticsPage() {
  const params = useParams();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [rawData, setRawData] = useState<Dataset[]>([]);

  useEffect(() => {
    const fetchDataset = async () => {
      const { data, error } = await supabase
        .from("datasets")
        .select("*")
        .eq("id", params.id);

      if (error) {
        console.error("Error fetching dataset:", error);
        return;
      }

      if (data) {
        setRawData(data);
        const transformedData = data[0].data
          .filter((row: DataRow) => row.month && row.revenue)
          .map((row: DataRow) => ({
            month: row.month as string,
            revenue: row.revenue as number,
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
          <div className="mb-4 p-4 bg-gray-100 rounded text-black">
            <h3 className="font-bold mb-2">Raw Data:</h3>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
              {JSON.stringify(rawData, null, 2)}
            </pre>
            <h3 className="font-bold mb-2 mt-4">Chart Data:</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(chartData, null, 2)}
            </pre>
          </div>

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
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
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
