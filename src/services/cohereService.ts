
import { CohereClient } from "cohere-ai";

// Using the API key
const COHERE_API_KEY = "phPQaSdkrQWbgvYxBfJfVS15GRBrMkUTgyHQmIXq";
const client = new CohereClient({
  token: COHERE_API_KEY,
});

// Define the types as expected by Cohere API
type UserMessage = {
  role: "USER";
  message: string;
};

type ChatbotMessage = {
  role: "CHATBOT";
  message: string;
};

type Message = UserMessage | ChatbotMessage;

// Store conversation chat history
let chatHistory: Message[] = [];

// System preamble - tornando mais conciso para acelerar o processamento
const systemPreamble = `Você é o Lumichat, um assistente simpático criado por Luis Guilherme. 
Seja conciso e direto nas respostas.`;

// Initialize a new conversation
export const initConversation = async () => {
  // Reset conversation history
  chatHistory = [];
  return true;
};

// Send a message and get a response
export const sendMessage = async (userMessage: string): Promise<string> => {
  try {
    // Get response from Cohere with lower temperature para respostas mais rápidas
    const response = await client.chat({
      model: "command-a-03-2025",
      temperature: 0.2, // Reduzido para respostas mais determinísticas e rápidas
      message: userMessage,
      preamble: systemPreamble,
      chatHistory: chatHistory.length > 0 ? chatHistory : undefined,
      maxTokens: 500, // Limitando o tamanho da resposta para maior velocidade
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

export const streamChatResponse = async (
  userMessage: string,
  onMessageChunk: (chunk: string) => void,
  onComplete: () => void
) => {
  try {
    // Start streaming response com configurações otimizadas
    const stream = await client.chatStream({
      model: "command-a-03-2025",
      temperature: 0.2, // Reduzido para respostas mais rápidas
      message: userMessage,
      preamble: systemPreamble,
      chatHistory: chatHistory.length > 0 ? chatHistory : undefined,
      maxTokens: 500, // Limitando o tamanho para maior velocidade
    });

    let fullResponse = "";

    for await (const message of stream) {
      if (message.eventType === "text-generation") {
        const chunk = message.text || "";
        onMessageChunk(chunk);
        fullResponse += chunk;
      }
    }
    
    // Add messages to chat history after completion
    chatHistory.push({
      role: "USER",
      message: userMessage
    });
    
    chatHistory.push({
      role: "CHATBOT", 
      message: fullResponse
    });
    
    onComplete();
  } catch (error) {
    console.error("Erro ao comunicar com a API da Cohere:", error);
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

