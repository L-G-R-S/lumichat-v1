
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
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('perplexityApiKey') || '');
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
    if (!apiKey) {
      toast({
        title: "API Key necessária",
        description: "Por favor, insira sua API key da Perplexity primeiro.",
        variant: "destructive"
      });
      return;
    }

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
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente prestativo e amigável. Responda em português do Brasil.'
            },
            {
              role: 'user',
              content
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na API');
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

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
      toast({
        title: "Erro",
        description: "Não foi possível obter a resposta. Verifique sua API key.",
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

  const updateApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('perplexityApiKey', key);
    toast({
      title: "API Key atualizada",
      description: "Sua API key foi salva com sucesso.",
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
    updateApiKey,
  };
};

