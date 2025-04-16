
import React from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message?: {
    role: "user" | "assistant";
    content: string;
    pending?: boolean;
  };
  type?: "user" | "bot";
  content?: string;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, type, content, isLoading }) => {
  // Use message object if provided, otherwise use type/content props
  const isBot = message ? message.role === "assistant" : type === "bot";
  const messageContent = message ? message.content : content;
  const isPending = message ? message.pending : isLoading;
  
  return (
    <div className={cn(
      "flex w-full gap-3 p-4",
      isBot ? "bg-muted/30" : ""
    )}>
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
        isBot ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {isBot ? <Bot size={18} /> : <User size={18} />}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="prose prose-slate dark:prose-invert break-words">
          {messageContent || (isPending ? 
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary/40 animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-primary/40 animate-pulse delay-75" />
              <span className="h-2 w-2 rounded-full bg-primary/40 animate-pulse delay-150" />
            </span> : 
            "...")}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
