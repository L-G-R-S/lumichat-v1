
import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, PlusCircle, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FileUploadDialog from "./FileUploadDialog";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && !isDisabled && !isLoading) {
      onSendMessage(message);
      setMessage("");
      
      // Foco no textarea depois de enviar
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Ajustar altura do textarea conforme o conteúdo
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

  // Focar no textarea ao carregar o componente
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 px-4">
      <div className="flex items-end gap-2 bg-background/80 backdrop-blur-sm border rounded-xl shadow-sm p-2">
        <Button 
          variant="ghost" 
          size="icon" 
          type="button"
          className="rounded-full h-9 w-9 flex-shrink-0 hover:bg-primary/10"
          onClick={() => setShowFileUpload(true)}
        >
          <PlusCircle className="h-5 w-5 text-primary/80" />
        </Button>
        
        <FileUploadDialog
          isOpen={showFileUpload}
          onClose={() => setShowFileUpload(false)}
          onFileProcess={(content) => {
            const fileMessage = content.startsWith('data:image/') 
              ? `[Imagem enviada] ${content}`
              : `[Arquivo enviado]\n\nConteúdo:\n${content}`;
            onSendMessage(fileMessage);
          }}
        />
        
        <Textarea
          ref={textareaRef}
          placeholder="Como posso ajudar você hoje?"
          className="min-h-[50px] max-h-[200px] border-0 focus-visible:ring-0 resize-none py-3 bg-transparent"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled || isLoading}
        />
        
        <div className="flex gap-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            type="button"
            onClick={() => setIsListening(!isListening)}
            className={`rounded-full h-9 w-9 ${isListening ? 'bg-red-500/10 hover:bg-red-500/20' : 'hover:bg-primary/10'}`}
          >
            {isListening ? 
              <MicOff className="h-5 w-5 text-red-500" /> : 
              <Mic className="h-5 w-5 text-primary/80" />
            }
          </Button>
          
          <Button 
            className={`rounded-full h-9 w-9 ${
              !message.trim() || isDisabled || isLoading 
                ? 'bg-muted text-muted-foreground hover:bg-muted' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            } transition-all duration-200 ease-in-out`}
            size="icon" 
            type="button"
            onClick={handleSendMessage}
            disabled={!message.trim() || isDisabled || isLoading}
          >
            {isLoading ? 
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : 
              <Send className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-center text-xs text-center text-muted-foreground mt-2">
        <Sparkles className="h-3 w-3 mr-1 text-primary/70" />
        <p>LumiChat AI com tecnologia Cohere pode produzir informações incorretas</p>
      </div>
    </div>
  );
};

export default ChatInput;
