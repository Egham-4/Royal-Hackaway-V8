import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
    </div>
  );
}
