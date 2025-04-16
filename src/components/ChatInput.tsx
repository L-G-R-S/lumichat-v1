
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic } from "lucide-react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && !isDisabled && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
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

  return (
    <div className="flex items-end gap-2 bg-background border rounded-full p-2 pl-4">
      <Textarea
        ref={textareaRef}
        placeholder="Como posso ajudar?"
        className="min-h-[40px] max-h-[200px] border-0 focus-visible:ring-0 resize-none bg-transparent"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled || isLoading}
      />
      
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="rounded-full h-8 w-8"
          disabled={isDisabled || isLoading}
        >
          <Mic className="h-4 w-4 text-muted-foreground" />
        </Button>
        
        <Button
          className="rounded-full h-9 w-9 p-0"
          size="icon"
          type="button"
          onClick={handleSendMessage}
          disabled={!message.trim() || isDisabled || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
