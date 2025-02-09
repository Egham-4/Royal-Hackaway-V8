"use client";

import { useState } from "react";
import { AddDatasetCard } from "./AddDatasetCard";
import { DatasetCard } from "./DataSetCard";

interface Dataset {
  id: string;
  name: string;
  description: string;
  date: string;
  size: string;
}

export function DatasetSection() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  const handleAddDataset = (
    title: string,
    description: string,
    file: File | null
  ) => {
    const newDataset: Dataset = {
      id: crypto.randomUUID(),
      name: title,
      description: description,
      date: new Date().toLocaleDateString(),
      size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "0 MB",
    };

    setDatasets([...datasets, newDataset]);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-4 grid-flow-dense">
      <AddDatasetCard onAdd={handleAddDataset} />
      {datasets.map((dataset) => (
        <DatasetCard key={dataset.id} dataset={dataset} />
      ))}
    </div>
  );
}
