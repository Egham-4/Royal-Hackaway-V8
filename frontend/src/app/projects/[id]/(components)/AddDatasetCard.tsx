"use client";

import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AddDatasetDialog } from "./AddDatasetDialog";

interface AddDatasetCardProps {
  onAdd: (title: string, description: string, file: File | null) => void;
}

export function AddDatasetCard({ onAdd }: AddDatasetCardProps) {
  const handleDatasetAdd = (
    title: string,
    description: string,
    file: File | null
  ) => {
    onAdd(title, description, file);
  };

  return (
    <AddDatasetDialog onDatasetAdd={handleDatasetAdd}>
      <Card className="w-[350px] h-[200px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors">
        <Plus className="h-10 w-10" />
        <span className="font-medium">Add New Dataset</span>
      </Card>
    </AddDatasetDialog>
  );
}
