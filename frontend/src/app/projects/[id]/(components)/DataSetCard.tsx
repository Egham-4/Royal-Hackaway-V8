"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, MoreVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DatasetCardProps {
  dataset: {
    id: string;
    name: string;
    description: string;
    date: string;
    size: string;
  };
  onDelete?: (id: string) => void;
}

export function DatasetCard({ dataset, onDelete }: DatasetCardProps) {
  const router = useRouter();

  const handleAnalyze = () => {
    router.push(`/analytics/${dataset.id}`);
  };
  return (
    <Card className="flex flex-col p-4 space-y-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold">{dataset.name}</h3>
          <p className="text-sm text-muted-foreground">{dataset.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDelete?.(dataset.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center text-sm text-muted-foreground">
        <span>{dataset.date}</span>
        <span className="mx-2">•</span>
        <span>{dataset.size}</span>
      </div>

      <div className="flex gap-2 mt-auto">
        <Button className="flex-1" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button className="flex-1" onClick={handleAnalyze}>
          <BarChart3 className="mr-2 h-4 w-4" />
          Analyze
        </Button>
      </div>
    </Card>
  );
}
