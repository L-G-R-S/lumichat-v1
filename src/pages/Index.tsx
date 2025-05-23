
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import { useChat } from "@/context/ChatContext";

const Index = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    conversations,
    activeConversationId,
    activeConversation,
    isLoading,
    isDarkMode,
    sendMessage,
    createNewChat,
    clearHistory,
    deleteConversation,
    setActiveConversationId,
    toggleDarkMode
  } = useChat();

  // Auto-start a new conversation if none exists
  useEffect(() => {
    if (!isInitialized && conversations.length === 0) {
      createNewChat();
      setIsInitialized(true);
    }
  }, [conversations.length, createNewChat, isInitialized]);

  return (
    <div className="flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <Sidebar
        onNewChat={createNewChat}
        onClearHistory={clearHistory}
        onDeleteConversation={deleteConversation}
        conversations={conversations}
        activeConversation={activeConversationId}
        onSelectConversation={setActiveConversationId}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      
      <main className="flex-1 flex flex-col w-full">
        <ChatArea
          messages={activeConversation?.messages || []}
          isLoading={isLoading}
          onSendMessage={sendMessage}
        />
      </main>
    </div>
  );
};

export default Index;
