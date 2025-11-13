import { ChevronUp } from "lucide-react";

import { Navigation } from "@organisms/navigation";
import { SidebarContainer } from "@organisms/SidebarContainer";
import { cn } from "@lib/utils";

interface CommunityLayoutProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
}

export function CommunityLayout({ children, className, showSidebar = true }: CommunityLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <Navigation />

      {/* Main Content Area */}
      <div className="container py-6">
        <div className={cn("flex gap-6", showSidebar ? "flex-col lg:flex-row" : "justify-center")}>
          {/* Main Content */}
          <main
            className={cn(
              "flex-1 min-w-0",
              showSidebar ? "lg:max-w-3xl" : "max-w-4xl w-full",
              className,
            )}
          >
            {children}
          </main>

          {/* Sidebar - Desktop Only */}
          {showSidebar && (
            <div className="hidden lg:block">
              <SidebarContainer />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar - Bottom Sheet Style */}
      {showSidebar && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-sm font-medium">더 보기</span>
                <ChevronUp className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4 max-h-96 overflow-y-auto">
                <SidebarContainer className="w-full" />
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
