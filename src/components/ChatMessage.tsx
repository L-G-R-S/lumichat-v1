
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
      "flex gap-3 max-w-full",
      isBot ? "justify-start" : "justify-end"
    )}>
      {isBot && (
        <div className="flex h-8 w-8 rounded-full bg-primary text-primary-foreground items-center justify-center shrink-0">
          <Bot size={18} />
        </div>
      )}
      
      <div className={cn(
        "px-4 py-3 rounded-2xl max-w-[80%]",
        isBot 
          ? "bg-secondary text-secondary-foreground rounded-bl-none" 
          : "bg-primary text-primary-foreground rounded-br-none"
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
        <div className="flex h-8 w-8 rounded-full bg-muted items-center justify-center shrink-0">
          <User size={18} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
