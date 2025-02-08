"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
}

export function ProjectCard({ title, description }: ProjectCardProps) {
  return (
    <Card className="w-[350px] h-[200px] flex flex-col justify-between p-4">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-4">{description}</CardDescription>
      </div>
      <Button asChild>
        <Link href="/signup">View More Details</Link>
      </Button>
    </Card>
  );
}
