"use client";

import { AddDatasetCard } from "./AddDatasetCard";

export function DatasetSection() {
  const handleAddDataset = (
    title: string,
    description: string,
    file: File | null
  ) => {
    console.log("New dataset:", { title, description, file });
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Project Datasets</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AddDatasetCard onAdd={handleAddDataset} />
      </div>
    </div>
  );
}
