import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DatasetCardProps {
  dataset: {
    id: string;
    name: string;
    description: string;
    date: string;
    size: string;
  };
  onDelete: (id: string) => void;
}

export function DatasetCard({ dataset, onDelete }: DatasetCardProps) {
  return (
    <Card className="relative group">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{dataset.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(dataset.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {dataset.description}
        </p>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{dataset.date}</span>
          <span>{dataset.size}</span>
        </div>
      </CardContent>
    </Card>
  );
}
