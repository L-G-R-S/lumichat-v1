
import React from "react";
import { Bot, User, Copy, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type MessageType = "user" | "bot";

interface ChatMessageProps {
  type: MessageType;
  content: string;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ type, content, isLoading = false }) => {
  const isBotMessage = type === "bot";
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Mensagem copiada!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar mensagem");
    }
  };

  const renderContent = () => {
    // Check if the content is a base64 image
    if (content.startsWith('data:image')) {
      return (
        <div className="mt-2">
          <p className="mb-2 text-sm text-muted-foreground">[Imagem enviada]</p>
          <img 
            src={content} 
            alt="Imagem enviada"
            className="max-w-[300px] rounded-lg shadow-sm"
          />
        </div>
      );
    }

    // Handle file uploads that start with [Arquivo enviado]
    if (content.includes('[Arquivo enviado]')) {
      return (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">{content.split('\n')[0]}</p>
          <div className="mt-2 p-3 bg-muted/30 rounded-lg">
            <ReactMarkdown>{content.split('\n').slice(2).join('\n')}</ReactMarkdown>
          </div>
        </div>
      );
    }

    // Default content rendering
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none break-words">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  };
  
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
      
      <div className="flex-1 flex flex-col">
        <div className={cn(
          "px-5 py-4 rounded-2xl shadow-sm relative",
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
            renderContent()
          )}

          {isBotMessage && !isLoading && (
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "absolute bottom-2 left-2 opacity-70 hover:opacity-100 transition-opacity",
                copied && "text-green-500"
              )}
              onClick={copyToClipboard}
            >
              {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
