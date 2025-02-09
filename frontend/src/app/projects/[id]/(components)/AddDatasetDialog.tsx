"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { fetch_auth } from "@/app/utils/auth";

interface AddDatasetDialogProps {
  onDatasetAdd: (title: string, description: string, file: File | null) => void;
  children: React.ReactNode;
}

export function AddDatasetDialog({
  onDatasetAdd,
  children,
}: AddDatasetDialogProps) {
  // set variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Function to handle when submit is clicked.
  const handleSubmit = async () => {
    onDatasetAdd(title, description, file);

    const formData = new FormData();
    formData.append("file", file)
    let fileUploadUrl = process.env.API_URL + '/fileupload'
    console.log(fileUploadUrl)

    //const response = await fetch(fileUploadUrl, {
    //  method: "POST",
    //  body: formData
    //})
    //
    const response = await fetch_auth(fileUploadUrl, {
      method: "POST",
      body: formData
    })

    console.log(response)

    setTitle("");
    setDescription("");
    setFile(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Dataset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Dataset Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Dataset Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="space-y-2">
            <Label htmlFor="file">Upload Dataset File</Label>
            <Input
              id="file"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Supported formats: CSV, Excel (.xlsx, .xls)
            </p>
          </div>
          <DialogTrigger>

            <Button onClick={handleSubmit}>Add Dataset</Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}
