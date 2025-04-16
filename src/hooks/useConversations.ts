
import { useState } from "react";
import { Conversation, Message } from "@/types/chat";
import { generateId } from "@/utils/chatUtils";
import { useToast } from "./use-toast";
import * as cohereService from "@/services/cohereService";

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
    
    // Reiniciar a conversa com a Cohere
    cohereService.initConversation()
      .then(() => {
        return true;
      })
      .catch(error => {
        console.error("Falha ao inicializar nova conversa na Cohere:", error);
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
    
    // Reiniciar a conversa com a Cohere
    cohereService.initConversation()
      .catch(error => {
        console.error("Falha ao reiniciar conversa após limpar histórico:", error);
      });
  };

  const deleteConversation = (id: string) => {
    const conversationToDelete = conversations.find(conv => conv.id === id);
    
    if (!conversationToDelete) return;
    
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    // Se a conversa ativa for excluída, defina a primeira conversa como ativa
    // ou null se não houver mais conversas
    if (activeConversationId === id) {
      const remainingConversations = conversations.filter(conv => conv.id !== id);
      setActiveConversationId(remainingConversations.length > 0 ? remainingConversations[0].id : null);
      
      // Reiniciar a conversa com a Cohere
      cohereService.initConversation()
        .catch(error => {
          console.error("Falha ao reiniciar conversa após exclusão:", error);
        });
    }
    
    toast({
      title: "Conversa excluída",
      description: `"${conversationToDelete.title.slice(0, 20)}${conversationToDelete.title.length > 20 ? '...' : ''}" foi removida.`,
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
    deleteConversation,
    addMessageToConversation
  };
};
