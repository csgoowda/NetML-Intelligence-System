import { Link, useLocation } from "wouter";
import { Activity, LayoutDashboard, Network, Video } from "lucide-react";
import clsx from "clsx";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/network-concepts", label: "Network Protocol", icon: Network },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-primary">Stream</span>Chat
              <span className="text-muted-foreground text-sm font-normal ml-2 tracking-widest uppercase">Platform v1.0</span>
            </h1>
          </div>
          
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={clsx(
                    "px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 cursor-pointer",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_-2px_hsl(var(--primary)/0.3)]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-6 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-muted-foreground font-mono">
          STREAM_CHAT_DEMO // RESEARCH_PREVIEW // {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
