
import { CohereClientV2 } from "cohere-ai";

// Using the new API key from your example
const COHERE_API_KEY = "phPQaSdkrQWbgvYxBfJfVS15GRBrMkUTgyHQmIXq";
const client = new CohereClientV2({
  token: COHERE_API_KEY,
});

// Store conversation context
let conversationContext: { role: string; content: string }[] = [];

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
      role: "user",
      content: userMessage,
    };
    
    // Create full message array with system prompt and context
    const messages = [
      {
        role: "system",
        content: `Você é a Lumi, uma assistente virtual criada por Luis Guilherme. 
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
    
    // Get response from Cohere using the new V2 client
    const response = await client.chat({
      model: "command-a-03-2025",
      temperature: 0.3,
      messages: messages,
    });
    
    // Add assistant response to context
    if (response.text) {
      const assistantMsg = {
        role: "assistant", 
        content: response.text
      };
      conversationContext.push(assistantMsg);
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
    // Add user message to context
    const userMsg = {
      role: "user",
      content: userMessage,
    };
    
    // Add to context for future messages
    conversationContext.push(userMsg);
    
    // Create full message array with system prompt and context
    const messages = [
      {
        role: "system",
        content: `Você é a Lumi, uma assistente virtual criada por Luis Guilherme. 
        Seu nome é Lumi e não Command. Nunca se identifique como Command. 
        Sempre se apresente como Lumi, com personalidade educada, clara e em português brasileiro.

        Quando alguém perguntar seu nome, diga: "Meu nome é Lumi, sou sua assistente de inteligência artificial. Como posso te ajudar?"
        Responda sempre com empatia e profissionalismo.`
      },
      ...conversationContext
    ];

    const stream = await client.chatStream({
      model: "command-a-03-2025",
      temperature: 0.3,
      messages: messages,
    });

    let fullResponse = "";

    for await (const message of stream) {
      if (message.eventType === "text-generation") {
        onMessageChunk(message.text || "");
        fullResponse += message.text || "";
      }
    }
    
    // Add assistant response to context after stream completes
    const assistantMsg = {
      role: "assistant", 
      content: fullResponse
    };
    conversationContext.push(assistantMsg);
    
    onComplete();
  } catch (error) {
    console.error("Erro ao comunicar com a API da Cohere:", error);
    onMessageChunk("\n\nOcorreu um erro ao comunicar com a Lumi. Por favor, tente novamente.");
    onComplete();
  }
};
