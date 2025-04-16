
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import { useChat } from "@/hooks/useChat";

const Index = () => {
  const {
    conversations,
    activeConversationId,
    isLoading,
    isDarkMode,
    activeConversation,
    handleNewChat,
    handleClearHistory,
    handleSendMessage,
    setActiveConversationId,
    toggleDarkMode,
  } = useChat();

  // Auto-start a new conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      handleNewChat();
    }
  }, []);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
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
        />
      </main>
    </div>
  );
};

export default Index;

