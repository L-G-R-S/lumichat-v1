
import React from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

type MessageType = "user" | "bot";

interface ChatMessageProps {
  type: MessageType;
  content: string;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ type, content, isLoading = false }) => {
  const isBotMessage = type === "bot";
  
  return (
    <div 
      className={cn(
        "flex w-full max-w-4xl mx-auto gap-4 p-4",
        "animate-in fade-in slide-in-from-bottom-3 duration-300 ease-in-out",
        isBotMessage ? "items-start" : "items-start"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-9 h-9 rounded-full shrink-0 border",
        isBotMessage 
          ? "bg-primary/10 text-primary border-primary/20" 
          : "bg-secondary/70 text-foreground border-secondary"
      )}>
        {isBotMessage ? <Bot size={18} /> : <User size={18} />}
      </div>
      
      <div className={cn(
        "flex-1 px-5 py-4 rounded-2xl shadow-sm",
        isBotMessage 
          ? "bg-secondary/40 text-foreground border border-secondary/40" 
          : "bg-primary/5 text-foreground border border-primary/10"
      )}>
        {isLoading ? (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-150" />
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-300" />
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none break-words">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
