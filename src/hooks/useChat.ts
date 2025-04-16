
import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import * as botpressService from "@/services/botpressService";
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

  // Inicializar a conversa com Botpress quando o componente for montado
  useEffect(() => {
    const initializeBot = async () => {
      try {
        await botpressService.initConversation();
        console.log("Botpress inicializado com sucesso");
        setIsBotpressConnected(true);
      } catch (error) {
        console.error("Falha ao inicializar o Botpress:", error);
        setIsBotpressConnected(false);
        
        if (error instanceof Error && error.message.includes('CORS')) {
          toast({
            title: "Erro de CORS Detectado",
            description: "Não é possível conectar diretamente à API do Botpress do navegador. É necessário um proxy ou backend intermediário.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Falha na Conexão com o Bot",
            description: "Verifique sua conexão com a internet e tente novamente.",
            variant: "destructive"
          });
        }
      }
    };
    
    initializeBot();
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
    handleSendMessage: sendMessage,
    setActiveConversationId,
    toggleDarkMode,
    updateApiKey: () => {},
  };
};
