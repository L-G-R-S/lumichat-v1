
import { useState } from "react";
import { Message } from "@/types/chat";
import { generateId } from "@/utils/chatUtils";
import { useToast } from "./use-toast";
import * as cohereService from "@/services/cohereService";
import { toast } from "sonner";
import { CohereError, CohereTimeoutError } from "cohere-ai";

export const useMessageHandling = (
  activeConversationId: string | null,
  createNewConversation: () => string,
  addMessageToConversation: (conversationId: string, message: Message) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAIConnected, setIsAIConnected] = useState(true);
  const { toast: uiToast } = useToast();

  const sendMessage = async (content: string) => {
    // If there's no active conversation, create one
    if (!activeConversationId) {
      const newId = createNewConversation();
      setTimeout(() => {
        handleSendMessageToAI(newId, content);
      }, 0);
      return;
    }
    
    await handleSendMessageToAI(activeConversationId, content);
  };

  const handleSendMessageToAI = async (conversationId: string, content: string) => {
    // Add user message to the conversation
    const userMessage: Message = {
      id: generateId(),
      type: "user",
      content,
    };
    
    addMessageToConversation(conversationId, userMessage);
    
    setIsLoading(true);

    try {
      if (!isAIConnected) {
        throw new Error("Serviço de IA não está conectado");
      }
      
      // Enviar mensagem para a Cohere e obter resposta
      const botResponse = await cohereService.sendMessage(content);
      
      const botMessage: Message = {
        id: generateId(),
        type: "bot",
        content: botResponse,
      };
      
      addMessageToConversation(conversationId, botMessage);
    } catch (error) {
      console.error("Erro na comunicação com Cohere:", error);
      
      // Preparar mensagem de erro apropriada
      let errorDescription = "Erro desconhecido";
      
      if (error instanceof CohereTimeoutError) {
        errorDescription = "A solicitação para a API da Cohere expirou.";
      } else if (error instanceof CohereError) {
        errorDescription = `Erro ${error.statusCode}: ${error.message}`;
      } else if (error instanceof Error) {
        errorDescription = error.message;
      }
      
      // Exibir toast de erro
      toast.error("Erro de Comunicação", {
        description: `Não foi possível obter resposta da Cohere. ${errorDescription}`
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
    isBotpressConnected: isAIConnected,
    setIsBotpressConnected: setIsAIConnected,
    sendMessage
  };
};
