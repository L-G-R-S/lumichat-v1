
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { CohereError, CohereTimeoutError } from "cohere-ai";
import * as cohereService from "@/services/cohereService";
import { Message } from "@/types/chat";

/**
 * Hook principal que gerencia a comunicação com o serviço Cohere
 */
export const useChatService = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isServiceConnected, setIsServiceConnected] = useState(false);

  // Inicializar o serviço ao montar o componente
  useEffect(() => {
    initializeService();
  }, []);

  // Inicializa o serviço Cohere
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
        description: "Verifique sua conexão com a internet e tente novamente.",
      });
      return false;
    }
  };

  // Enviar mensagem e receber resposta em streaming
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Adicionar mensagem do usuário
    const userMessageId = uuidv4();
    const userMessage: Message = {
      id: userMessageId,
      type: "user",
      content,
    };

    // Adicionar mensagem temporária do assistente para streaming
    const botMessageId = uuidv4();
    const botMessage: Message = {
      id: botMessageId,
      type: "bot",
      content: "",
      pending: true,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    setIsLoading(true);

    // Limitar o histórico para melhorar a performance
    cohereService.trimChatHistory();

    // Stream da resposta
    let fullResponse = "";
    try {
      if (!isServiceConnected) {
        // Tentar reconectar se não estiver conectado
        const reconnected = await initializeService();
        if (!reconnected) {
          throw new Error("Serviço de IA não está conectado");
        }
      }

      await cohereService.streamChatResponse(
        content,
        (chunk) => {
          fullResponse += chunk;
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === botMessageId ? { ...msg, content: fullResponse } : msg
            )
          );
        },
        () => {
          // Finalizar a mensagem quando terminar
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, pending: false, content: fullResponse }
                : msg
            )
          );
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Erro ao comunicar com o serviço de IA:", error);
      
      // Obter mensagem de erro baseada no tipo de erro
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
      } else {
        toast.error("Erro de conexão", {
          description: "Não foi possível conectar à API.",
        });
      }
      
      // Atualizar a mensagem do assistente com o erro
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, pending: false, content: errorMessage }
            : msg
        )
      );
      setIsLoading(false);
    }
  }, [isServiceConnected]);

  // Limpar mensagens
  const clearMessages = useCallback(() => {
    setMessages([]);
    initializeService(); // Reiniciar a conversa
    toast.success("Conversa limpa", {
      description: "Todas as mensagens foram removidas.",
    });
  }, []);

  return {
    messages,
    isLoading,
    isServiceConnected,
    sendMessage,
    clearMessages,
    initializeService,
  };
};
