
import React, { useRef, useEffect, useState } from "react";
import { usePerplexity } from "@/hooks/usePerplexity";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, BrainCircuit, Key } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const LumiChat: React.FC = () => {
  const { messages, isLoading, apiKey, sendMessage, clearMessages, updateApiKey } = usePerplexity();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [inputApiKey, setInputApiKey] = useState(apiKey);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set initial API key on component mount
  useEffect(() => {
    if (apiKey === "") {
      // Use the hard-coded key for this specific instance
      const initialKey = "phPQaSdkrQWbgvYxBfJfVS15GRBrMkUTgyHQmIXq";
      updateApiKey(initialKey);
      setInputApiKey(initialKey);
      
      toast({
        title: "API Key configurada",
        description: "API Key da Perplexity foi configurada automaticamente.",
      });
    }
  }, [apiKey, updateApiKey]);

  const handleSaveApiKey = () => {
    updateApiKey(inputApiKey);
    setShowApiKeyInput(false);
    toast({
      title: "API Key atualizada",
      description: "Sua API Key foi atualizada com sucesso.",
    });
  };

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
            variant="outline" 
            size="sm" 
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="flex items-center gap-1"
          >
            <Key className="h-4 w-4" />
            API Key
          </Button>
          
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
      
      {/* API Key Input */}
      {showApiKeyInput && (
        <div className="p-4 bg-secondary/20 m-4 rounded-md">
          <div className="flex flex-col gap-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              API Key da Perplexity:
            </label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                value={inputApiKey}
                onChange={(e) => setInputApiKey(e.target.value)}
                placeholder="Insira sua API key aqui"
                className="flex-1"
              />
              <Button onClick={handleSaveApiKey} disabled={!inputApiKey.trim()}>
                Salvar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Obtenha sua API key em:{" "}
              <a
                href="https://www.perplexity.ai/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                perplexity.ai/settings/api
              </a>
            </p>
          </div>
        </div>
      )}
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <BrainCircuit className="h-12 w-12 mb-4 text-primary/60" />
            <h2 className="text-xl font-medium mb-2">Bem-vindo à Lumi</h2>
            <p className="max-w-md">
              Olá! Eu sou a Lumi, sua assistente de IA agora com tecnologia Perplexity. Como posso te ajudar hoje?
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
          isDisabled={isLoading || !apiKey}
          isLoading={isLoading}
        />
        <p className="text-xs text-center text-muted-foreground mt-2">
          LumiChat com tecnologia Perplexity
        </p>
      </div>
    </div>
  );
};

export default LumiChat;
