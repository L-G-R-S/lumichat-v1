
import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
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
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
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
      <div className="chat-input-container flex items-end gap-2 p-2">
        <Button 
          variant="ghost" 
          size="icon" 
          type="button"
          className="rounded-full h-9 w-9 flex-shrink-0"
        >
          <PlusCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
        
        <Textarea
          ref={textareaRef}
          placeholder="Como posso ajudar?"
          className="chat-input min-h-[50px] max-h-[200px] border-0 focus-visible:ring-0 resize-none py-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        
        <div className="flex gap-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            type="button"
            onClick={() => setIsListening(!isListening)}
            className="rounded-full h-9 w-9"
          >
            {isListening ? 
              <MicOff className="h-5 w-5 text-red-500" /> : 
              <Mic className="h-5 w-5 text-muted-foreground" />
            }
          </Button>
          
          <Button 
            className={`rounded-full h-9 w-9 ${(!message.trim() || isLoading) ? 'opacity-50' : 'opacity-100'}`}
            size="icon" 
            type="button"
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-2">
        LumiChat AI com tecnologia Cohere pode produzir informações incorretas.
      </p>
    </div>
  );
};

export default ChatInput;
