
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Conversation, Message } from "@/types/chat";
import { generateId } from "@/utils/chatUtils";
import * as cohereService from "@/services/cohereService";

/**
 * Hook para gerenciar as conversas do chat
 */
export const useConversationManager = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Cria uma nova conversa
  const createNewConversation = useCallback(() => {
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
      .catch(error => {
        console.error("Falha ao inicializar nova conversa:", error);
      });
      
    return newId;
  }, []);

  // Adiciona uma mensagem a uma conversa
  const addMessageToConversation = useCallback((conversationId: string, message: Message) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          // Atualizar o título da conversa se for a primeira mensagem do usuário
          const shouldUpdateTitle = conv.messages.length === 0 && message.type === "user";
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
  }, []);

  // Limpa o histórico de conversas
  const clearConversationHistory = useCallback(() => {
    setConversations([]);
    setActiveConversationId(null);
    
    // Reiniciar a conversa com a Cohere
    cohereService.initConversation()
      .catch(error => {
        console.error("Falha ao reiniciar conversa após limpar histórico:", error);
      });
    
    toast.success("Histórico apagado", {
      description: "Todas as conversas foram removidas.",
    });
  }, []);

  // Exclui uma conversa específica
  const deleteConversation = useCallback((id: string) => {
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
    
    toast.success("Conversa excluída", {
      description: `"${conversationToDelete.title.slice(0, 20)}${conversationToDelete.title.length > 20 ? '...' : ''}" foi removida.`,
    });
  }, [conversations, activeConversationId]);

  // Conversa ativa atual
  const activeConversation = conversations.find((conv) => conv.id === activeConversationId);

  return {
    conversations,
    setConversations,
    activeConversationId,
    activeConversation,
    setActiveConversationId,
    createNewConversation,
    addMessageToConversation,
    clearConversationHistory,
    deleteConversation,
  };
};
