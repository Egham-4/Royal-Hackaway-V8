"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ProjectCardProps {
  title: string;
  description: string;
}

export function ProjectCard({ title, description }: ProjectCardProps) {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
