
import { useState, useCallback } from "react";
import { streamChatResponse } from "@/services/cohereService";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/types/chat";

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
      type: "user",
    };

    // Add temporary assistant message for streaming
    const assistantMessageId = uuidv4();
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: "",
      type: "bot",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage, assistantMessage]);
    setIsLoading(true);

    // Stream the response
    let fullResponse = "";
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
              ? { ...msg, content: fullResponse }
              : msg
          )
        );
        setIsLoading(false);
      }
    );
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
