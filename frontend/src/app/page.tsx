import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import { testWorkflow } from "@/ai/data_reporter";

export default function Home() {
  {
    /*testWorkflow().then(() => console.log("Test completed")); */
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Pricing />
      <CTA />
    </div>
  );
}
