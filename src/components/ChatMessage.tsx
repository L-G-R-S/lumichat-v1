
import React from "react";
import { Bot, User, Copy, CheckCheck, FileText } from "lucide-react";
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
    // Verificar se é uma imagem
    if (content.includes('[Imagem enviada]')) {
      const imageData = content.split('[Imagem enviada] ')[1];
      return (
        <div className="mt-2">
          <img 
            src={imageData} 
            alt="Imagem enviada"
            className="max-w-full sm:max-w-[300px] rounded-lg shadow-sm"
          />
        </div>
      );
    }

    // Verificar se é um PDF
    if (content.includes('[PDF enviado]')) {
      return (
        <div className="mt-2 p-3 md:p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary/70" />
            <p className="text-sm">{content.split('[PDF enviado] ')[1]}</p>
          </div>
        </div>
      );
    }

    // Verificar se é outro tipo de arquivo
    if (content.includes('[Arquivo enviado]')) {
      if (content.includes('\n\nConteúdo:\n')) {
        // Arquivo com conteúdo legível
        const fileInfo = content.split('\n\nConteúdo:\n')[0].replace('[Arquivo enviado: ', '').replace(']', '');
        const fileContent = content.split('\n\nConteúdo:\n')[1];
        
        return (
          <div className="mt-2">
            <div className="p-3 md:p-3 bg-muted/30 rounded-lg mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary/70" />
                <p className="text-xs sm:text-sm">{fileInfo}</p>
              </div>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none overflow-auto">
              <ReactMarkdown>{fileContent}</ReactMarkdown>
            </div>
          </div>
        );
      } else {
        // Arquivo sem conteúdo legível
        return (
          <div className="mt-2 p-3 md:p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary/70" />
              <p className="text-sm">{content.split('[Arquivo enviado] ')[1]}</p>
            </div>
          </div>
        );
      }
    }

    // Mensagem normal com texto
    return (
      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none break-words">
        <ReactMarkdown 
          components={{
            p: ({node, ...props}) => <p className="mb-4" {...props} />,
            h1: ({node, ...props}) => <h1 className="text-lg md:text-xl font-bold mb-3" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-base md:text-lg font-semibold mb-3" {...props} />,
            ul: ({node, ...props}) => <ul className="pl-4 mb-4 list-disc" {...props} />,
            ol: ({node, ...props}) => <ol className="pl-4 mb-4 list-decimal" {...props} />,
            code: ({node, ...props}) => <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "flex w-full max-w-4xl mx-auto gap-3 md:gap-4 p-3 md:p-4",
        "animate-in fade-in slide-in-from-bottom-3 duration-300 ease-in-out",
        isBotMessage ? "items-start" : "items-start"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full shrink-0 border",
        isBotMessage 
          ? "bg-primary/10 text-primary border-primary/20" 
          : "bg-secondary/70 text-foreground border-secondary"
      )}>
        {isBotMessage ? <Bot size={16} className="md:text-[18px]" /> : <User size={16} className="md:text-[18px]" />}
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className={cn(
          "px-4 py-3 md:px-5 md:py-4 rounded-2xl shadow-sm relative",
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

          {!isLoading && content && (
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "absolute bottom-2 right-2 opacity-70 hover:opacity-100 transition-opacity h-7 w-7 md:h-8 md:w-8",
                copied && "text-green-500"
              )}
              onClick={copyToClipboard}
            >
              {copied ? <CheckCheck size={14} className="md:h-4 md:w-4" /> : <Copy size={14} className="md:h-4 md:w-4" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
