
import React, { useRef, useEffect, useState } from "react";
import { useCohere } from "@/hooks/useCohere";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, BrainCircuit, Key } from "lucide-react";
import { toast } from "sonner";

const LumiChat: React.FC = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useCohere();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

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
        
        <div className="flex items-center gap-2">
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
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <BrainCircuit className="h-12 w-12 mb-4 text-primary/60" />
            <h2 className="text-xl font-medium mb-2">Bem-vindo à Lumi</h2>
            <p className="max-w-md">
              Olá! Eu sou a Lumi, sua assistente de IA com tecnologia Cohere. Como posso te ajudar hoje?
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              type={message.role === "user" ? "user" : "bot"} 
              content={message.content}
              isLoading={message.pending}
            />
          ))
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
