
import { useState, useCallback } from "react";
import { streamChatResponse } from "@/services/cohereService";
import { v4 as uuidv4 } from "uuid";

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
      
      // Update the assistant message with error
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, pending: false, content: "Ocorreu um erro ao comunicar com a Lumi. Por favor, verifique sua API key e tente novamente." }
            : msg
        )
      );
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
