
import { useState } from "react";
import { useToast } from "./use-toast";

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

  const handleNewChat = () => {
    const newId = generateId();
    const newConversation: Conversation = {
      id: newId,
      title: `Nova Conversa`,
      messages: [],
    };
    
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newId);
  };

  const handleClearHistory = () => {
    toast({
      title: "Histórico apagado",
      description: "Todas as conversas foram removidas.",
    });
    setConversations([]);
    setActiveConversationId(null);
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
      // Simulação de resposta, já que o Botpress estará lidando com as respostas reais
      setTimeout(() => {
        const botMessage: Message = {
          id: generateId(),
          type: "bot",
          content: "Esta mensagem está sendo exibida apenas na interface. As respostas reais serão fornecidas pelo widget do Botpress no canto inferior direito da tela.",
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
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível obter a resposta.",
        variant: "destructive"
      });
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
