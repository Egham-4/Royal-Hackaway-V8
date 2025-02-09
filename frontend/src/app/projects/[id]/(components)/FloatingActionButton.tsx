"use client";

import { buildApiUrl, fetch_auth } from "@/app/utils/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

interface FloatingActionButtonProps {
  onSubmit: (title: string, description: string, file: File | null) => void;
}

export function FloatingActionButton({ onSubmit }: FloatingActionButtonProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, description, file);

    let formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', description)

    let uploadURL = buildApiUrl('/fileupload')
    let response = await fetch_auth(uploadURL, {
      method: "POST",
      body: formData
    })

    console.log(response)

    setTitle("");
    setDescription("");
    setFile(null);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Dataset</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Dataset Title"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Description"
              required
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
            />
            <Button type="submit" className="w-full">
              Add Dataset
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
