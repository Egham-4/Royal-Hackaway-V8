import { BarChart3, LineChart, PieChart } from "lucide-react";
import { MetricCard } from "../(components)/MetricCard";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6 p-8">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Chart 1</h3>
          {/* Add your chart component here */}
        </div>
        <div className="p-6 bg-card rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Chart 2</h3>
          {/* Add your chart component here */}
        </div>

        <div className="p-6 bg-card rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Chart 3</h3>
          {/* Add your chart component here */}
        </div>
        <div className="p-6 bg-card rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Chart 4</h3>
          {/* Add your chart component here */}
        </div>
      </div>
    </div>
  );
}
