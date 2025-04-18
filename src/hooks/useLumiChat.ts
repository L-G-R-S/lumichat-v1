
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useConversationManager } from "./useConversationManager";
import { useThemeToggle } from "./useThemeToggle";
import * as cohereService from "@/services/cohereService";
import { Message } from "@/types/chat";
import { CohereError, CohereTimeoutError } from "cohere-ai";

/**
 * Hook principal que une todas as funcionalidades do LumiChat
 */
export const useLumiChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isServiceConnected, setIsServiceConnected] = useState(false);
  
  const conversationManager = useConversationManager();
  const { 
    conversations, 
    setConversations,
    activeConversationId, 
    activeConversation,
    setActiveConversationId,
    createNewConversation,
    addMessageToConversation,
    clearConversationHistory,
    deleteConversation
  } = conversationManager;
  
  const { isDarkMode, toggleDarkMode } = useThemeToggle();

  // Inicializa o serviço quando o componente é montado
  useEffect(() => {
    initializeService();
  }, []);

  // Função para inicializar o serviço
  const initializeService = async () => {
    try {
      await cohereService.initConversation();
      console.log("Serviço de IA inicializado com sucesso");
      setIsServiceConnected(true);
      return true;
    } catch (error) {
      console.error("Falha ao inicializar o serviço de IA:", error);
      setIsServiceConnected(false);
      
      toast.error("Falha na Conexão", {
        description: "Não foi possível conectar ao serviço de IA. Verifique sua conexão.",
      });
      
      return false;
    }
  };

  // Envia uma mensagem e processa a resposta
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Se não houver conversa ativa, cria uma nova
    let targetConversationId = activeConversationId;
    if (!targetConversationId) {
      targetConversationId = createNewConversation();
    }

    // Adiciona mensagem do usuário à conversa
    const userMessage: Message = {
      id: uuidv4(),
      type: "user",
      content,
    };
    addMessageToConversation(targetConversationId, userMessage);
    
    // Prepara para receber resposta
    setIsLoading(true);

    try {
      if (!isServiceConnected) {
        // Tenta reconectar se não estiver conectado
        const reconnected = await initializeService();
        if (!reconnected) {
          throw new Error("Serviço de IA não está conectado");
        }
      }
      
      // Limitar o histórico para melhorar a performance
      cohereService.trimChatHistory();
      
      // Obtém resposta em streaming
      let fullResponse = "";
      const botMessageId = uuidv4();
      
      // Adiciona mensagem temporária do bot
      const pendingBotMessage: Message = {
        id: botMessageId,
        type: "bot",
        content: "",
        pending: true
      };
      addMessageToConversation(targetConversationId, pendingBotMessage);
      
      await cohereService.streamChatResponse(
        content,
        (chunk) => {
          // Atualiza a mensagem com cada pedaço da resposta
          fullResponse += chunk;
          
          // Atualiza a mensagem na conversa
          const updatedMessage: Message = {
            id: botMessageId,
            type: "bot",
            content: fullResponse,
            pending: true
          };
          
          // Substitui a mensagem na conversa
          conversationManager.setConversations(prevConversations => 
            prevConversations.map(conv => {
              if (conv.id === targetConversationId) {
                return {
                  ...conv,
                  messages: conv.messages.map(msg => 
                    msg.id === botMessageId ? updatedMessage : msg
                  )
                };
              }
              return conv;
            })
          );
        },
        () => {
          // Completa a mensagem quando terminar
          const completedMessage: Message = {
            id: botMessageId,
            type: "bot",
            content: fullResponse,
            pending: false
          };
          
          // Atualiza novamente a conversa
          conversationManager.setConversations(prevConversations => 
            prevConversations.map(conv => {
              if (conv.id === targetConversationId) {
                return {
                  ...conv,
                  messages: conv.messages.map(msg => 
                    msg.id === botMessageId ? completedMessage : msg
                  )
                };
              }
              return conv;
            })
          );
          
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Erro na comunicação com o serviço de IA:", error);
      
      // Obtém mensagem de erro baseada no tipo
      let errorMessage = "Ocorreu um erro ao comunicar com o LumiChat. Por favor, tente novamente.";
      
      if (error instanceof CohereTimeoutError) {
        errorMessage = "A solicitação expirou. Por favor, tente novamente mais tarde.";
        toast.error("Tempo limite excedido", {
          description: "A solicitação para a API expirou.",
        });
      } else if (error instanceof CohereError) {
        errorMessage = `Erro na API: ${error.message}`;
        toast.error(`Erro (${error.statusCode || 'desconhecido'})`, {
          description: error.message,
        });
      } else if (error instanceof Error) {
        errorMessage = `Erro: ${error.message}`;
        toast.error("Erro de comunicação", {
          description: error.message,
        });
      }
      
      // Adiciona mensagem de erro como resposta do bot
      const errorBotMessage: Message = {
        id: uuidv4(),
        type: "bot",
        content: errorMessage,
      };
      addMessageToConversation(targetConversationId, errorBotMessage);
      
      setIsLoading(false);
    }
  }, [
    activeConversationId, 
    createNewConversation, 
    addMessageToConversation, 
    isServiceConnected,
    conversationManager
  ]);

  return {
    // Estados
    isLoading,
    isDarkMode,
    isServiceConnected,
    
    // Gerenciamento de conversas
    conversations,
    activeConversationId,
    activeConversation,
    
    // Ações
    sendMessage,
    createNewChat: createNewConversation,
    clearHistory: clearConversationHistory,
    deleteConversation,
    setActiveConversationId,
    toggleDarkMode,
    initializeService,
  };
};
