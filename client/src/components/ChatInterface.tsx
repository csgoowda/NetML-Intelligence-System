import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { type Message } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isSending: boolean;
}

export function ChatInterface({ messages, onSendMessage, isSending }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/80 backdrop-blur">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          StreamChat Assistant
        </h3>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
            <Bot className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">No messages yet.</p>
            <p className="text-xs opacity-60 mt-2">Ask anything about the video stream.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              "flex gap-3 max-w-[90%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
              msg.role === 'user' 
                ? "bg-secondary/10 border-secondary/20 text-secondary" 
                : "bg-primary/10 border-primary/20 text-primary"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={clsx(
              "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-secondary text-secondary-foreground rounded-tr-none" 
                : "bg-muted text-foreground rounded-tl-none border border-border"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isSending && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex gap-3 mr-auto max-w-[80%]"
          >
             <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
               <Loader2 className="w-4 h-4 animate-spin" />
             </div>
             <div className="bg-muted border border-border p-3 rounded-2xl rounded-tl-none text-sm text-muted-foreground italic flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
               <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
               <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
             </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-muted/30 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
            placeholder="Ask about the video context..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
