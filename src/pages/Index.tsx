
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import { useChat } from "@/hooks/useChat";
import { useThemeToggle } from "@/hooks/useThemeToggle";

const Index = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isDarkMode, toggleDarkMode } = useThemeToggle();
  
  const {
    conversations,
    activeConversationId,
    isLoading,
    apiKey,
    activeConversation,
    handleNewChat,
    handleClearHistory,
    handleDeleteConversation,
    handleSendMessage,
    setActiveConversationId,
  } = useChat();

  // Auto-start a new conversation if none exists
  useEffect(() => {
    if (!isInitialized && conversations.length === 0) {
      handleNewChat();
      setIsInitialized(true);
    }
  }, [conversations.length, handleNewChat, isInitialized]);

  return (
    <div className="min-h-screen flex flex-col">
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
      
      <main className="flex-1 flex flex-col pl-0 lg:pl-[280px]">
        <ChatArea
          messages={activeConversation?.messages || []}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          apiKey={apiKey}
          onApiKeySubmit={() => {}}
        />
      </main>
    </div>
  );
};

export default Index;
