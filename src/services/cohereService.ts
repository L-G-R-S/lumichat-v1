
import { CohereClient } from "cohere-ai";
import { supabase } from "@/integrations/supabase/client";
import { generateUUID } from "@/utils/uuid";

// Using the API key
const COHERE_API_KEY = "phPQaSdkrQWbgvYxBfJfVS15GRBrMkUTgyHQmIXq";
const client = new CohereClient({
  token: COHERE_API_KEY,
});

// System preamble - tornando mais conciso para acelerar o processamento
const systemPreamble = `Você é o Lumichat, um assistente simpático criado por Luis Guilherme. 
Seja conciso e direto nas respostas.`;

interface ChatMessage {
  role: "USER" | "CHATBOT";
  message: string;
}

// Store conversation chat history
let chatHistory: ChatMessage[] = [];
let currentSessionId: string | null = null;

// Initialize a new conversation
export const initConversation = async () => {
  // Reset conversation history
  chatHistory = [];
  // Generate new session ID
  currentSessionId = generateUUID();
  return true;
};

// Send a message and get a response
export const sendMessage = async (userMessage: string): Promise<string> => {
  try {
    // Ensure session ID exists
    if (!currentSessionId) {
      currentSessionId = generateUUID();
    }

    // Store user message in Supabase
    await supabase.from('chat_messages').insert({
      user_id: null, // Since we're not using authentication yet
      type: 'user',
      content: userMessage
    });

    // Get response from Cohere with lower temperature para respostas mais rápidas
    const response = await client.chat({
      model: "command-a-03-2025",
      temperature: 0.2,
      message: userMessage,
      preamble: systemPreamble,
      chatHistory: chatHistory.length > 0 ? chatHistory : undefined,
      maxTokens: 500,
    });
    
    // Store bot response in Supabase
    await supabase.from('chat_messages').insert({
      user_id: null, // Since we're not using authentication yet
      type: 'bot',
      content: response.text || "Desculpe, não consegui processar sua solicitação."
    });
    
    // Add messages to chat history
    chatHistory.push({
      role: "USER",
      message: userMessage
    });
    
    if (response.text) {
      chatHistory.push({
        role: "CHATBOT", 
        message: response.text
      });
    }
    
    return response.text || "Desculpe, não consegui processar sua solicitação.";
  } catch (error) {
    console.error("Erro ao comunicar com a API da Cohere:", error);
    throw error;
  }
};

// New function for streaming chat responses
export const streamChatResponse = async (
  userMessage: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
): Promise<void> => {
  try {
    // Ensure session ID exists
    if (!currentSessionId) {
      currentSessionId = generateUUID();
    }

    // Store user message in Supabase
    await supabase.from('chat_messages').insert({
      user_id: null,
      type: 'user',
      content: userMessage
    });

    // Add user message to chat history
    chatHistory.push({
      role: "USER",
      message: userMessage
    });

    let fullResponse = "";

    // Get streaming response from Cohere
    const stream = await client.chatStream({
      model: "command-a-03-2025",
      temperature: 0.2,
      message: userMessage,
      preamble: systemPreamble,
      chatHistory: chatHistory.length > 0 ? chatHistory : undefined,
      maxTokens: 500,
    });

    // Process each chunk from the stream
    for await (const chunk of stream) {
      if (chunk.eventType === "text-generation") {
        fullResponse += chunk.text;
        onChunk(chunk.text);
      }
    }

    // Store the complete bot response in Supabase
    await supabase.from('chat_messages').insert({
      user_id: null,
      type: 'bot',
      content: fullResponse
    });

    // Add bot message to chat history
    chatHistory.push({
      role: "CHATBOT",
      message: fullResponse
    });

    // Signal completion
    onComplete();

  } catch (error) {
    console.error("Erro ao processar stream da API da Cohere:", error);
    throw error;
  }
};

// Adicionar função para limitar histórico de chat (evita excesso de tokens)
export const trimChatHistory = () => {
  // Manter apenas as últimas 6 mensagens (3 interações) para manter o contexto essencial
  if (chatHistory.length > 6) {
    chatHistory = chatHistory.slice(chatHistory.length - 6);
  }
};

// Função para recuperar histórico de mensagens de uma sessão
export const getChatHistory = async () => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('type, content, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao recuperar histórico de mensagens:', error);
    return [];
  }

  return data || [];
};
