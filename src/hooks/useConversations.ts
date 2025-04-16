
import { useState } from "react";
import { Conversation, Message } from "@/types/chat";
import { generateId } from "@/utils/chatUtils";
import { useToast } from "./use-toast";
import * as botpressService from "@/services/botpressService";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  const createNewConversation = () => {
    const newId = generateId();
    const newConversation: Conversation = {
      id: newId,
      title: `Nova Conversa`,
      messages: [],
    };
    
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newId);
    
    // Reiniciar a conversa com Botpress
    botpressService.initConversation()
      .then(() => {
        return true;
      })
      .catch(error => {
        console.error("Falha ao inicializar nova conversa no Botpress:", error);
        return false;
      });
      
    return newId;
  };

  const clearConversationHistory = () => {
    toast({
      title: "Histórico apagado",
      description: "Todas as conversas foram removidas.",
    });
    setConversations([]);
    setActiveConversationId(null);
    
    // Reiniciar a conversa com Botpress
    botpressService.initConversation()
      .catch(error => {
        console.error("Falha ao reiniciar conversa após limpar histórico:", error);
      });
  };

  const addMessageToConversation = (conversationId: string, message: Message) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const shouldUpdateTitle = conv.messages.length === 0;
          return {
            ...conv,
            title: shouldUpdateTitle 
              ? message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "") 
              : conv.title,
            messages: [...conv.messages, message],
          };
        }
        return conv;
      })
    );
  };

  return {
    conversations,
    activeConversationId,
    activeConversation: conversations.find((conv) => conv.id === activeConversationId),
    setActiveConversationId,
    createNewConversation,
    clearConversationHistory,
    addMessageToConversation
  };
};
