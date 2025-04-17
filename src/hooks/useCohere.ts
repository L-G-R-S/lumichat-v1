
import { useState, useCallback } from "react";
import { streamChatResponse, trimChatHistory } from "@/services/cohereService";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { CohereError, CohereTimeoutError } from "cohere-ai";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  pending?: boolean;
}

export const useCohere = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessageId = uuidv4();
    const userMessage: Message = {
      id: userMessageId,
      content,
      role: "user",
    };

    // Add temporary assistant message for streaming
    const assistantMessageId = uuidv4();
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: "",
      role: "assistant",
      pending: true,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage, assistantMessage]);
    setIsLoading(true);

    // Limitar o histórico para melhorar a performance
    trimChatHistory();

    // Stream the response
    let fullResponse = "";
    try {
      await streamChatResponse(
        content,
        (chunk) => {
          fullResponse += chunk;
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullResponse }
                : msg
            )
          );
        },
        () => {
          // Complete the message when finished
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, pending: false, content: fullResponse }
                : msg
            )
          );
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Erro ao comunicar com a API da Cohere:", error);
      
      // Get error message based on error type
      let errorMessage = "Ocorreu um erro ao comunicar com o Lumichat. Por favor, tente novamente.";
      
      if (error instanceof CohereTimeoutError) {
        errorMessage = "A solicitação expirou. Por favor, tente novamente mais tarde.";
        toast.error("Tempo limite excedido", {
          description: "A solicitação para a API da Cohere expirou.",
        });
      } else if (error instanceof CohereError) {
        errorMessage = `Erro na API da Cohere: ${error.message}`;
        toast.error(`Erro (${error.statusCode || 'desconhecido'})`, {
          description: error.message,
        });
      } else {
        toast.error("Erro de conexão", {
          description: "Não foi possível conectar à API da Cohere.",
        });
      }
      
      // Update the assistant message with error
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, pending: false, content: errorMessage }
            : msg
        )
      );
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    toast.success("Conversa limpa", {
      description: "Todas as mensagens foram removidas.",
    });
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
