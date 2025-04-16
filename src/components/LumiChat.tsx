
import React, { useRef, useEffect } from "react";
import { useCohere } from "@/hooks/useCohere";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Button } from "@/components/ui/button";
import { Trash2, BrainCircuit } from "lucide-react";
import WelcomeScreen from "./WelcomeScreen";

const LumiChat: React.FC = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useCohere();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const showWelcome = messages.length === 0;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">LumiChat</h1>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearMessages}
          disabled={messages.length === 0 || isLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar conversa
        </Button>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showWelcome ? (
          <WelcomeScreen onSampleQuestionClick={sendMessage} />
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t">
        <ChatInput 
          onSendMessage={sendMessage} 
          isDisabled={isLoading} 
          isLoading={isLoading}
        />
        <p className="text-xs text-center text-muted-foreground mt-2">
          LumiChat com tecnologia Cohere
        </p>
      </div>
    </div>
  );
};

export default LumiChat;
