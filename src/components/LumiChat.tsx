
import React, { useRef, useEffect } from "react";
import { useCohere } from "@/hooks/useCohere";
import { useChat } from "@/hooks/useChat";
import ChatArea from "./ChatArea";
import Sidebar from "./Sidebar";

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
    toggleDarkMode,
    apiKey,
    updateApiKey
  } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
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
      <ChatArea 
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
        apiKey={apiKey}
        onApiKeySubmit={updateApiKey}
      />
    </div>
  );
};

export default LumiChat;
