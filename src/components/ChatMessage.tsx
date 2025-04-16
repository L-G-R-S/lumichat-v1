
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
    <div className={cn(
      "flex w-full max-w-4xl mx-auto gap-4 p-4 animate-fade-in",
      isBotMessage ? "items-start" : "items-start"
    )}>
      <div className={cn(
        "flex items-center justify-center w-9 h-9 rounded-md shrink-0",
        isBotMessage ? "bg-primary text-white" : "bg-secondary text-foreground"
      )}>
        {isBotMessage ? <Bot size={20} /> : <User size={20} />}
      </div>
      
      <div className={cn(
        "flex-1 px-4 py-3",
        isBotMessage ? "chat-bubble-bot" : "chat-bubble-user"
      )}>
        {isLoading ? (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-75" />
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-150" />
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
