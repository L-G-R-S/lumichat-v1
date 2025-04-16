
import { useChat } from "@/hooks/useChat";
import LumiChat from "@/components/LumiChat";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  const {
    conversations,
    activeConversationId,
    isLoading,
    isDarkMode,
    activeConversation,
    handleNewChat,
    handleClearHistory,
    handleDeleteConversation,
    handleSendMessage,
    setActiveConversationId,
    toggleDarkMode,
  } = useChat();

  return (
    <div className="flex h-screen bg-background">
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
      
      <div className="flex-1 flex flex-col relative">
        <LumiChat 
          isLoading={isLoading}
          messages={activeConversation?.messages || []}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Index;
