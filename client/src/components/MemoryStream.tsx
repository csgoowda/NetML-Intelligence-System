import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Clock, Database, MessageSquare } from "lucide-react";
import { type MemoryLog } from "@shared/schema";
import clsx from "clsx";

interface MemoryStreamProps {
  logs: MemoryLog[];
  isProcessing: boolean;
}

export function MemoryStream({ logs: initialLogs, isProcessing }: MemoryStreamProps) {
  // We'll manage a local display list to allow for simulated additions
  const [displayLogs, setDisplayLogs] = useState<MemoryLog[]>([]);

  useEffect(() => {
    // Sync with props but reverse for display (newest top)
    if (initialLogs) {
      setDisplayLogs(initialLogs.slice().reverse());
    }
  }, [initialLogs]);

  // Simulation effect: When "processing" is true, randomly add "thought" logs
  useEffect(() => {
    if (!isProcessing) return;
    
    const thoughts = [
      { type: 'short_term', content: 'Analyzing frame 4024: Object motion detected' },
      { type: 'short_term', content: 'Buffer analysis: Spatial redundancy found' },
      { type: 'long_term', content: 'Context update: Scene transition confirmed' },
      { type: 'dialogue', content: 'User intent classified: Query about visual content' },
      { type: 'short_term', content: 'Encoding vector representation...' },
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
        const newLog: MemoryLog = {
          id: Date.now(),
          videoId: 0,
          type: thought.type,
          content: thought.content,
          timestamp: new Date(),
        };
        setDisplayLogs(prev => [newLog, ...prev].slice(0, 50));
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'short_term': return "text-primary border-primary/20 bg-primary/5";
      case 'long_term': return "text-secondary border-secondary/20 bg-secondary/5";
      case 'dialogue': return "text-accent border-accent/20 bg-accent/5";
      default: return "text-muted-foreground border-border";
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'short_term': return <Clock className="w-3 h-3" />;
      case 'long_term': return <Database className="w-3 h-3" />;
      case 'dialogue': return <MessageSquare className="w-3 h-3" />;
      default: return <BrainCircuit className="w-3 h-3" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-card/50 border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <BrainCircuit className="w-4 h-4" />
          Neural Memory Stream
        </h3>
        {isProcessing && (
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
        <AnimatePresence initial={false}>
          {displayLogs.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 opacity-50">
              Waiting for neural activity...
            </div>
          ) : (
            displayLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0 }}
                className={clsx(
                  "p-2 rounded border flex items-start gap-3",
                  getTypeColor(log.type)
                )}
              >
                <div className="mt-0.5 opacity-70">
                  {getTypeIcon(log.type)}
                </div>
                <div>
                  <div className="opacity-50 text-[10px] uppercase tracking-wider mb-0.5">
                    {new Date(log.timestamp!).toLocaleTimeString()} • {log.type.replace('_', ' ')}
                  </div>
                  <div>{log.content}</div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
