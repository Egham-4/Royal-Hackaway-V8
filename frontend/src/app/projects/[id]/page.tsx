import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DatasetSection } from "./(components)/DataSection";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <header className="space-y-2 text-center sm:text-left">
            <div className="flex items-start justify-center text-center md:justify-start">
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-20">
                Project Analysis #{id}
              </h1>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Data Insights
            </h2>
            <p className="text-lg text-muted-foreground">
              View and analyze your project metrics
            </p>
          </header>

          <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
            <img
              src="/images/home.png"
              alt="Analysis Dashboard"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <DatasetSection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
