
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

// Bot responses for simulation
const botResponses = [
  "Essa é uma excelente pergunta! Com base nas informações disponíveis, posso dizer que...",
  "Existem várias maneiras de abordar essa questão. Primeiramente, é importante considerar que...",
  "De acordo com as pesquisas mais recentes nessa área, os especialistas indicam que...",
  "Essa é uma questão complexa que envolve diversos fatores. Vamos analisar cada um deles...",
  "Entendo sua curiosidade sobre esse tema. A resposta curta é que depende do contexto, mas vou explicar em detalhes...",
  "Ótima pergunta! Isso é um tema fascinante que tem recebido muita atenção ultimamente...",
  "Do ponto de vista técnico, o processo funciona assim: primeiro, os dados são coletados e depois processados através de...",
  "Historicamente, esse conceito evoluiu bastante ao longo do tempo. Inicialmente...",
  "Existem prós e contras a serem considerados. Por um lado, temos os benefícios de... Por outro lado, os desafios incluem...",
  "Vamos dividir isso em partes para facilitar o entendimento. Primeiro vamos falar sobre...",
];

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const handleSendMessage = (content: string) => {
    if (!activeConversationId) {
      const newId = generateId();
      const newConversation: Conversation = {
        id: newId,
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        messages: [],
      };
      
      setConversations((prev) => [newConversation, ...prev]);
      setActiveConversationId(newId);
      
      // Add message after creating new chat
      setTimeout(() => {
        addMessageToConversation(newId, content);
      }, 0);
      
      return;
    }
    
    addMessageToConversation(activeConversationId, content);
  };

  const addMessageToConversation = (conversationId: string, content: string) => {
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
    
    // Simulate bot response
    setIsLoading(true);
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage: Message = {
        id: generateId(),
        type: "bot",
        content: randomResponse,
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
    }, 1000 + Math.random() * 2000);
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
    activeConversation: conversations.find((conv) => conv.id === activeConversationId),
    handleNewChat,
    handleClearHistory,
    handleSendMessage,
    setActiveConversationId,
    toggleDarkMode,
  };
};

