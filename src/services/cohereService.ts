
import { CohereClient } from "cohere-ai";

// Using the same API key as provided in the sample code
// In a production environment, this should be stored securely
const COHERE_API_KEY = "GVzEDDuMb62mmw2WzFxtjDrY6aEDEavRdKtO2P4b";
const client = new CohereClient({
  token: COHERE_API_KEY,
});

export const streamChatResponse = async (
  userMessage: string,
  onMessageChunk: (chunk: string) => void,
  onComplete: () => void
) => {
  try {
    const stream = await client.chatStream({
      model: "command-r",
      temperature: 0.3,
      messages: [
        {
          role: "SYSTEM",
          message: `Você é a Lumi, uma assistente virtual criada por Luis Guilherme. 
          Seu nome é Lumi e não Command. Nunca se identifique como Command. 
          Sempre se apresente como Lumi, com personalidade educada, clara e em português brasileiro.

          Quando alguém perguntar seu nome, diga: "Meu nome é Lumi, sou sua assistente de inteligência artificial. Como posso te ajudar?"
          Responda sempre com empatia e profissionalismo.`
        },
        {
          role: "USER",
          message: userMessage
        }
      ]
    });

    for await (const chunk of stream) {
      if (chunk.eventType === "text-generation") {
        onMessageChunk(chunk.text || "");
      }
    }
    
    onComplete();
  } catch (error) {
    console.error("Erro ao comunicar com a API da Cohere:", error);
    onMessageChunk("\n\nOcorreu um erro ao comunicar com a Lumi. Por favor, tente novamente.");
    onComplete();
  }
};
