
import React, { createContext, useContext, ReactNode } from "react";
import { useLumiChat } from "@/hooks/useLumiChat";
import { Message, Conversation } from "@/types/chat";

// Interface para o contexto
interface ChatContextType {
  // Estado
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | undefined;
  isLoading: boolean;
  isDarkMode: boolean;
  isServiceConnected: boolean;
  
  // Ações
  sendMessage: (content: string) => Promise<void>;
  createNewChat: () => string;
  clearHistory: () => void;
  deleteConversation: (id: string) => void;
  setActiveConversationId: (id: string) => void;
  toggleDarkMode: () => void;
  initializeService: () => Promise<boolean>;
}

// Criar contexto
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider do contexto
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const chat = useLumiChat();
  
  return (
    <ChatContext.Provider value={chat}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook para usar o contexto
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error("useChat deve ser usado dentro de um ChatProvider");
  }
  
  return context;
};
