import { BarChart3, FileText, HelpCircle, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <>
      <Separator className="my-4" />
      <footer className="bg-card rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Analytics Dashboard v1.0
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Documentation
            </Button>
            <Button variant="ghost" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Support
            </Button>
            <Button variant="ghost" size="sm">
              <Github className="h-4 w-4 mr-2" />
              Repository
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            © 2025 Key Analysis. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
