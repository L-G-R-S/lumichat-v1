
import { CohereClient } from "cohere-ai";

// Using the API key
const COHERE_API_KEY = "phPQaSdkrQWbgvYxBfJfVS15GRBrMkUTgyHQmIXq";
const client = new CohereClient({
  token: COHERE_API_KEY,
});

// Store conversation chat history
let chatHistory: { role: string; message: string }[] = [];

// System preamble
const systemPreamble = `Você é o Lumichat, um assistente inteligente e simpático. 
Você foi criado por Luis Guilherme. Seu objetivo é ajudar os usuários com respostas claras, 
úteis e sempre com um toque amigável. Use uma linguagem acessível, e sempre que possível, 
seja acolhedor e proativo.`;

// Initialize a new conversation
export const initConversation = async () => {
  // Reset conversation history
  chatHistory = [];
  return true;
};

// Send a message and get a response
export const sendMessage = async (userMessage: string): Promise<string> => {
  try {
    // Get response from Cohere
    const response = await client.chat({
      model: "command-a-03-2025",
      temperature: 0.3,
      message: userMessage,
      preamble: systemPreamble,
      chatHistory: chatHistory.length > 0 ? chatHistory : undefined,
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
    // Start streaming response
    const stream = await client.chatStream({
      model: "command-a-03-2025",
      temperature: 0.3,
      message: userMessage,
      preamble: systemPreamble,
      chatHistory: chatHistory.length > 0 ? chatHistory : undefined,
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
