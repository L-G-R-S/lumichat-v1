
import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import * as botpressService from "@/services/botpressService";

// Types
export interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiKey] = useState<string>('');
  const { toast } = useToast();

  // Inicializar a conversa com Botpress quando o componente for montado
  useEffect(() => {
    botpressService.initConversation()
      .catch(error => {
        console.error("Falha ao inicializar o Botpress:", error);
        toast({
          title: "Erro de Conexão",
          description: "Não foi possível conectar ao assistente virtual.",
          variant: "destructive"
        });
      });
  }, []);

  const handleNewChat = () => {
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
      .catch(error => {
        console.error("Falha ao inicializar nova conversa no Botpress:", error);
      });
  };

  const handleClearHistory = () => {
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

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) {
      const newId = generateId();
      const newConversation: Conversation = {
        id: newId,
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        messages: [],
      };
      
      setConversations((prev) => [newConversation, ...prev]);
      setActiveConversationId(newId);
      
      setTimeout(() => {
        addMessageToConversation(newId, content);
      }, 0);
      
      return;
    }
    
    await addMessageToConversation(activeConversationId, content);
  };

  const addMessageToConversation = async (conversationId: string, content: string) => {
    const userMessage: Message = {
      id: generateId(),
      type: "user",
      content,
    };
    
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const shouldUpdateTitle = conv.messages.length === 0;
          return {
            ...conv,
            title: shouldUpdateTitle ? content.slice(0, 30) + (content.length > 30 ? "..." : "") : conv.title,
            messages: [...conv.messages, userMessage],
          };
        }
        return conv;
      })
    );
    
    setIsLoading(true);

    try {
      // Enviar mensagem para o Botpress
      await botpressService.sendMessage(content);
      
      // Esperar um pouco para o Botpress processar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar a resposta do Botpress
      const botResponse = await botpressService.fetchBotResponse();
      
      const botMessage: Message = {
        id: generateId(),
        type: "bot",
        content: botResponse,
      };
      
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, botMessage],
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error("Erro na comunicação com Botpress:", error);
      toast({
        title: "Erro",
        description: "Não foi possível obter a resposta do assistente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return {
    conversations,
    activeConversationId,
    isLoading,
    isDarkMode,
    apiKey,
    activeConversation: conversations.find((conv) => conv.id === activeConversationId),
    handleNewChat,
    handleClearHistory,
    handleSendMessage,
    setActiveConversationId,
    toggleDarkMode,
    updateApiKey: () => {},
  };
};
