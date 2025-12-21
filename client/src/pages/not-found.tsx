import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-background text-foreground">
      <div className="flex mb-8">
        <AlertTriangle className="h-24 w-24 text-destructive animate-pulse" />
      </div>
      
      <h1 className="text-6xl font-bold tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl font-medium text-muted-foreground mb-8">Signal Lost</h2>
      
      <p className="text-center max-w-md text-muted-foreground mb-12">
        The requested neural pathway could not be found. 
        It may have been pruned from memory or never established.
      </p>

      <Link href="/">
        <a className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25">
          Return to Base
        </a>
      </Link>
    </div>
  );
}
