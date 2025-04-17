
import { useState, useCallback, useEffect } from "react";
import { streamChatResponse } from "@/services/perplexityService";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  pending?: boolean;
}

const API_KEY_STORAGE_KEY = "perplexity_api_key";

export const usePerplexity = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
  });

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    }
  }, [apiKey]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !apiKey) return;

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
      },
      apiKey
    );
  }, [apiKey]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const updateApiKey = useCallback((newKey: string) => {
    setApiKey(newKey);
  }, []);

  return {
    messages,
    isLoading,
    apiKey,
    sendMessage,
    clearMessages,
    updateApiKey,
  };
};
