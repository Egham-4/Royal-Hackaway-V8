import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold">Analytics AI</span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline">
            <Link href="/login">Log In</Link>
          </Button>
          <Button>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Data Analysis & AI Insights
          <br />
          <span className="text-primary">for Your Business</span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground">
          Transform your SME with powerful analytics and AI-driven insights
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </main>
    </div>
  );
}
