
import { useState } from "react";
import { Message } from "@/types/chat";
import { generateId } from "@/utils/chatUtils";
import { useToast } from "./use-toast";
import * as botpressService from "@/services/botpressService";

export const useMessageHandling = (
  activeConversationId: string | null,
  createNewConversation: () => string,
  addMessageToConversation: (conversationId: string, message: Message) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBotpressConnected, setIsBotpressConnected] = useState(true);
  const { toast } = useToast();

  const sendMessage = async (content: string) => {
    // If there's no active conversation, create one
    if (!activeConversationId) {
      const newId = createNewConversation();
      setTimeout(() => {
        handleSendMessageToBot(newId, content);
      }, 0);
      return;
    }
    
    await handleSendMessageToBot(activeConversationId, content);
  };

  const handleSendMessageToBot = async (conversationId: string, content: string) => {
    // Add user message to the conversation
    const userMessage: Message = {
      id: generateId(),
      type: "user",
      content,
    };
    
    addMessageToConversation(conversationId, userMessage);
    
    setIsLoading(true);

    try {
      if (!isBotpressConnected) {
        throw new Error("Botpress não está conectado");
      }
      
      // Enviar mensagem para o Botpress
      await botpressService.sendMessage(content);
      
      // Esperar um pouco para o Botpress processar
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Buscar a resposta do Botpress
      const botResponse = await botpressService.fetchBotResponse();
      
      const botMessage: Message = {
        id: generateId(),
        type: "bot",
        content: botResponse,
      };
      
      addMessageToConversation(conversationId, botMessage);
    } catch (error) {
      console.error("Erro na comunicação com Botpress:", error);
      
      // Exibir toast de erro específico
      toast({
        title: "Erro de Comunicação",
        description: "Não foi possível obter resposta do Botpress. Detalhes: " + 
                    (error instanceof Error ? error.message : "Erro desconhecido"),
        variant: "destructive"
      });
      
      // Adicionar mensagem de erro como resposta do bot
      const errorMessage: Message = {
        id: generateId(),
        type: "bot",
        content: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.",
      };
      
      addMessageToConversation(conversationId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isBotpressConnected,
    setIsBotpressConnected,
    sendMessage
  };
};
