
import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, PlusCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import FileUploader from "./FileHandling/FileUploader";
import FilePreview from "./FilePreview";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading = false,
  isDisabled = false 
}) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if ((message.trim() || selectedFile) && !isDisabled && !isLoading) {
      if (selectedFile) {
        import('@/utils/fileUtils').then(async ({ processFileForChat }) => {
          try {
            const loadingToast = toast.loading("Processando arquivo...");
            
            const processedMessage = await processFileForChat(selectedFile, message);
            toast.dismiss(loadingToast);
            
            onSendMessage(processedMessage);
            
            setMessage("");
            setSelectedFile(null);
            
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
              }
            }, 0);
          } catch (error) {
            console.error("Erro ao processar arquivo:", error);
            toast.error("Erro ao processar arquivo", {
              description: error instanceof Error ? error.message : "Não foi possível processar o arquivo"
            });
            
            if (message.trim()) {
              onSendMessage(message);
            }
            
            setMessage("");
            setSelectedFile(null);
          }
        }).catch(error => {
          console.error("Erro ao importar utilitários de arquivo:", error);
          toast.error("Erro interno", {
            description: "Não foi possível carregar o processador de arquivos"
          });
          
          if (message.trim()) {
            onSendMessage(message);
          }
          
          setMessage("");
          setSelectedFile(null);
        });
      } else {
        onSendMessage(message);
        setMessage("");
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }, 0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 px-3 md:px-4">
      <div className="flex flex-col bg-background/80 backdrop-blur-sm border rounded-xl shadow-sm p-2">
        {selectedFile && (
          <FilePreview 
            file={selectedFile}
            onRemove={() => setSelectedFile(null)}
          />
        )}
        
        <div className="flex items-end gap-1 md:gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            type="button"
            className="rounded-full h-8 w-8 md:h-9 md:w-9 flex-shrink-0 hover:bg-primary/10"
            onClick={() => setShowFileUpload(true)}
          >
            <PlusCircle className="h-4 w-4 md:h-5 md:w-5 text-primary/80" />
          </Button>
          
          <FileUploader
            isOpen={showFileUpload}
            onClose={() => setShowFileUpload(false)}
            onFileSelect={(file) => {
              setSelectedFile(file);
              setShowFileUpload(false);
            }}
            maxFileSizeMB={10}
            allowedFileTypes={['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg']}
          />
          
          <Textarea
            ref={textareaRef}
            placeholder={selectedFile ? "Descreva o que você quer fazer com este arquivo..." : "Como posso ajudar você hoje?"}
            className="min-h-[50px] max-h-[200px] border-0 focus-visible:ring-0 resize-none py-3 bg-transparent text-sm md:text-base"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled || isLoading}
          />
          
          <div className="flex gap-1 md:gap-2 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              type="button"
              onClick={() => setIsListening(!isListening)}
              className={`rounded-full h-8 w-8 md:h-9 md:w-9 ${isListening ? 'bg-red-500/10 hover:bg-red-500/20' : 'hover:bg-primary/10'}`}
            >
              {isListening ? 
                <MicOff className="h-4 w-4 md:h-5 md:w-5 text-red-500" /> : 
                <Mic className="h-4 w-4 md:h-5 md:w-5 text-primary/80" />
              }
            </Button>
            
            <Button 
              className={`rounded-full h-8 w-8 md:h-9 md:w-9 ${
                (!message.trim() && !selectedFile) || isDisabled || isLoading 
                  ? 'bg-muted text-muted-foreground hover:bg-muted' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              } transition-all duration-200 ease-in-out`}
              size="icon" 
              type="button"
              onClick={handleSendMessage}
              disabled={(!message.trim() && !selectedFile) || isDisabled || isLoading}
            >
              {isLoading ? 
                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : 
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              }
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center text-xs text-center text-muted-foreground mt-6 md:mt-8 w-full">
        <div className="flex items-center">
          <Bot className="h-3 w-3 mr-1 text-primary/70" />
          <p>LumiChat usa inteligência artificial para gerar respostas.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
