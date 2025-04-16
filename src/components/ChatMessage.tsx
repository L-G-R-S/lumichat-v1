
import React from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message?: {
    role: "user" | "assistant";
    content: string;
    pending?: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  if (!message) return null;
  
  const isBot = message.role === "assistant";
  const isPending = message.pending;
  
  return (
    <div className={cn(
      "px-4 py-6 flex items-start gap-4 max-w-5xl mx-auto",
      isBot ? "justify-start" : "justify-end"
    )}>
      {isBot && (
        <div className="flex h-9 w-9 rounded-full bg-primary/20 text-primary items-center justify-center shrink-0">
          <Bot size={20} />
        </div>
      )}
      
      <div className={cn(
        "px-5 py-4 rounded-2xl max-w-[85%]",
        isBot 
          ? "bg-secondary text-secondary-foreground rounded-tl-none border border-border/50" 
          : "bg-primary text-primary-foreground rounded-tr-none"
      )}>
        <div className="prose prose-sm dark:prose-invert break-words">
          {message.content || (isPending ? 
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-current opacity-60 animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-current opacity-60 animate-pulse delay-75" />
              <span className="h-2 w-2 rounded-full bg-current opacity-60 animate-pulse delay-150" />
            </span> : 
            "...")}
        </div>
      </div>
      
      {!isBot && (
        <div className="flex h-9 w-9 rounded-full bg-muted text-muted-foreground items-center justify-center shrink-0">
          <User size={20} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
