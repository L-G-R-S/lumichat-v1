
import { CohereClient } from "cohere-ai";

// Using the API key as provided in the sample code
// In a production environment, this should be stored securely
const COHERE_API_KEY = "GVzEDDuMb62mmw2WzFxtjDrY6aEDEavRdKtO2P4b";
const client = new CohereClient({
  token: COHERE_API_KEY,
});

// Store conversation context
let conversationContext: any[] = [];

// Initialize a new conversation
export const initConversation = async () => {
  // Reset conversation context
  conversationContext = [];
  return true;
};

// Send a message and get a response
export const sendMessage = async (userMessage: string): Promise<string> => {
  try {
    // Add user message to context
    const userMsg = {
      role: "USER",
      message: userMessage,
    };
    
    // Create full message array with system prompt and context
    const messages = [
      {
        role: "SYSTEM",
        message: `Você é a Lumi, uma assistente virtual criada por Luis Guilherme. 
        Seu nome é Lumi e não Command. Nunca se identifique como Command. 
        Sempre se apresente como Lumi, com personalidade educada, clara e em português brasileiro.

        Quando alguém perguntar seu nome, diga: "Meu nome é Lumi, sou sua assistente de inteligência artificial. Como posso te ajudar?"
        Responda sempre com empatia e profissionalismo.`
      },
      ...conversationContext,
      userMsg
    ];
    
    // Add to context for future messages
    conversationContext.push(userMsg);
    
    // Get response from Cohere
    const response = await client.chat({
      model: "command-r",
      temperature: 0.3,
      message: userMessage,
      preamble: `Você é a Lumi, uma assistente virtual criada por Luis Guilherme. 
      Seu nome é Lumi e não Command. Nunca se identifique como Command. 
      Sempre se apresente como Lumi, com personalidade educada, clara e em português brasileiro.

      Quando alguém perguntar seu nome, diga: "Meu nome é Lumi, sou sua assistente de inteligência artificial. Como posso te ajudar?"
      Responda sempre com empatia e profissionalismo.`,
      chatHistory: conversationContext.map(msg => ({
        role: msg.role,
        message: msg.message
      }))
    });
    
    // Add assistant response to context
    const assistantMsg = {
      role: "ASSISTANT", 
      message: response.text
    };
    conversationContext.push(assistantMsg);
    
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
    // Add user message to context
    const userMsg = {
      role: "USER",
      message: userMessage,
    };
    
    // Add to context for future messages
    conversationContext.push(userMsg);
    
    const stream = await client.chatStream({
      model: "command-r",
      temperature: 0.3,
      message: userMessage,
      preamble: `Você é a Lumi, uma assistente virtual criada por Luis Guilherme. 
      Seu nome é Lumi e não Command. Nunca se identifique como Command. 
      Sempre se apresente como Lumi, com personalidade educada, clara e em português brasileiro.

      Quando alguém perguntar seu nome, diga: "Meu nome é Lumi, sou sua assistente de inteligência artificial. Como posso te ajudar?"
      Responda sempre com empatia e profissionalismo.`,
      chatHistory: conversationContext.map(msg => ({
        role: msg.role,
        message: msg.message
      }))
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      if (chunk.eventType === "text-generation") {
        onMessageChunk(chunk.text || "");
        fullResponse += chunk.text || "";
      }
    }
    
    // Add assistant response to context after stream completes
    const assistantMsg = {
      role: "ASSISTANT", 
      message: fullResponse
    };
    conversationContext.push(assistantMsg);
    
    onComplete();
  } catch (error) {
    console.error("Erro ao comunicar com a API da Cohere:", error);
    onMessageChunk("\n\nOcorreu um erro ao comunicar com a Lumi. Por favor, tente novamente.");
    onComplete();
  }
};
