
import React, { useState } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
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

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 px-4">
      <div className="flex items-end gap-2 bg-background border rounded-lg shadow-subtle p-2">
        <Textarea
          placeholder="Faça uma pergunta..."
          className="min-h-[50px] max-h-[200px] border-0 focus-visible:ring-0 resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <div className="flex gap-2">
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
            className="rounded-full h-9 w-9" 
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
        LumiChat AI pode produzir informações incorretas.
      </p>
    </div>
  );
};

export default ChatInput;
