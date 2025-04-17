
import { CohereClient, CohereError, CohereTimeoutError } from "cohere-ai";

// Using the API key
const COHERE_API_KEY = "phPQaSdkrQWbgvYxBfJfVS15GRBrMkUTgyHQmIXq";
const client = new CohereClient({
  token: COHERE_API_KEY,
});

// Store conversation chat history
let chatHistory: { role: "USER" | "CHATBOT"; message: string }[] = [];

// System preamble
const systemPreamble = `Você é a Lumi, uma assistente virtual criada por Luis Guilherme. 
Seu nome é Lumi e não Command. Nunca se identifique como Command. 
Sempre se apresente como Lumi, com personalidade educada, clara e em português brasileiro.

Quando alguém perguntar seu nome, diga: "Meu nome é Lumi, sou sua assistente de inteligência artificial. Como posso te ajudar?"
Responda sempre com empatia e profissionalismo.`;

// Initialize a new conversation
export const initConversation = async () => {
  // Reset conversation history
  chatHistory = [];
  return true;
};

// Send a message and get a response
export const sendMessage = async (userMessage: string): Promise<string> => {
  try {
    // Add user message to chat history
    chatHistory.push({
      role: "USER",
      message: userMessage,
    });
    
    // Get response from Cohere
    const response = await client.chat({
      model: "command",
      temperature: 0.3,
      message: userMessage,
      preamble: systemPreamble,
      chatHistory: chatHistory,
    });
    
    // Add assistant response to chat history
    if (response.text) {
      chatHistory.push({
        role: "CHATBOT", 
        message: response.text
      });
    }
    
    return response.text || "Desculpe, não consegui processar sua solicitação.";
  } catch (error) {
    console.error("Erro ao comunicar com a API da Cohere:", error);
    
    // Handle specific Cohere errors
    if (error instanceof CohereTimeoutError) {
      console.error("Erro de timeout:", error);
      return "A solicitação expirou. Por favor, tente novamente.";
    } else if (error instanceof CohereError) {
      console.error(`Erro Cohere (${error.statusCode}):`, error.message);
      return `Erro na API da Cohere: ${error.message}`;
    }
    
    throw error;
  }
};

export const streamChatResponse = async (
  userMessage: string,
  onMessageChunk: (chunk: string) => void,
  onComplete: () => void
) => {
  try {
    // Add user message to chat history
    chatHistory.push({
      role: "USER",
      message: userMessage,
    });
    
    // Start streaming response
    const stream = await client.chatStream({
      model: "command",
      temperature: 0.3,
      message: userMessage,
      preamble: systemPreamble,
      chatHistory: chatHistory,
    });

    let fullResponse = "";

    for await (const message of stream) {
      if (message.eventType === "text-generation") {
        onMessageChunk(message.text || "");
        fullResponse += message.text || "";
      }
    }
    
    // Add assistant response to chat history after stream completes
    chatHistory.push({
      role: "CHATBOT", 
      message: fullResponse
    });
    
    onComplete();
  } catch (error) {
    console.error("Erro ao comunicar com a API da Cohere:", error);
    
    // Handle specific Cohere errors
    if (error instanceof CohereTimeoutError) {
      onMessageChunk("\n\nA solicitação expirou. Por favor, tente novamente.");
    } else if (error instanceof CohereError) {
      onMessageChunk(`\n\nErro na API da Cohere: ${error.message}`);
    } else {
      onMessageChunk("\n\nOcorreu um erro ao comunicar com a Lumi. Por favor, tente novamente.");
    }
    
    onComplete();
  }
};
