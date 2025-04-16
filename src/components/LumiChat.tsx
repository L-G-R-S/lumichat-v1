
import React, { useRef, useEffect } from "react";
import { useCohere } from "@/hooks/useCohere";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import { Bot } from "lucide-react";

const LumiChat: React.FC = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useCohere();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    conversations, 
    activeConversationId,
    setActiveConversationId,
    handleNewChat,
    handleClearHistory,
    handleDeleteConversation,
    isDarkMode,
    toggleDarkMode
  } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
        onDeleteConversation={handleDeleteConversation}
        conversations={conversations}
        activeConversation={activeConversationId}
        onSelectConversation={setActiveConversationId}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Bem-vindo à Lumi</h2>
              <p className="max-w-md">
                Olá! Eu sou a Lumi, sua assistente de IA. Como posso te ajudar hoje?
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input Area */}
        <div className="p-4 border-t">
          <ChatInput 
            onSendMessage={sendMessage} 
            isDisabled={isLoading} 
            isLoading={isLoading}
          />
          <p className="text-xs text-center text-muted-foreground mt-2">
            LumiChat AI com tecnologia Cohere pode produzir informações incorretas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LumiChat;
