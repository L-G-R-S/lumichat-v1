
import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import * as cohereService from "@/services/cohereService";
import { useConversations } from "./useConversations";
import { useMessageHandling } from "./useMessageHandling";
import { useThemeToggle } from "./useThemeToggle";
import { Message, Conversation } from "@/types/chat";

export type { Message, Conversation };

export const useChat = () => {
  const [apiKey] = useState<string>('');
  const { toast } = useToast();

  const {
    conversations,
    activeConversationId,
    activeConversation,
    setActiveConversationId,
    createNewConversation,
    clearConversationHistory,
    deleteConversation,
    addMessageToConversation
  } = useConversations();

  const {
    isLoading,
    isBotpressConnected,
    setIsBotpressConnected,
    sendMessage
  } = useMessageHandling(
    activeConversationId,
    createNewConversation,
    addMessageToConversation
  );

  const { isDarkMode, toggleDarkMode } = useThemeToggle();

  // Inicializar a conversa com a Cohere quando o componente for montado
  useEffect(() => {
    const initializeAI = async () => {
      try {
        await cohereService.initConversation();
        console.log("Serviço de IA inicializado com sucesso");
        setIsBotpressConnected(true);
      } catch (error) {
        console.error("Falha ao inicializar o serviço de IA:", error);
        setIsBotpressConnected(false);
        
        toast({
          title: "Falha na Conexão com o LumiChat",
          description: "Verifique sua conexão com a internet e tente novamente.",
          variant: "destructive"
        });
      }
    };
    
    initializeAI();
  }, []);

  return {
    conversations,
    activeConversationId,
    isLoading,
    isDarkMode,
    apiKey,
    isBotpressConnected,
    activeConversation,
    handleNewChat: createNewConversation,
    handleClearHistory: clearConversationHistory,
    handleDeleteConversation: deleteConversation,
    handleSendMessage: sendMessage,
    setActiveConversationId,
    toggleDarkMode,
    updateApiKey: () => {},
  };
};
