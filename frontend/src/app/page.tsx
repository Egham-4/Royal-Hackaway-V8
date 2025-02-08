import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Landing Page...</h1>
      <h2>Dark Mode Toggle</h2>
      <ModeToggle />
    </div>
  );
}
