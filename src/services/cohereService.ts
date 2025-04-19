
import { cohereApi } from "./cohereApi";

// Inicializar uma nova conversa
export const initConversation = async (): Promise<boolean> => {
  try {
    cohereApi.resetSession();
    return true;
  } catch (error) {
    console.error("Erro ao inicializar conversa:", error);
    return false;
  }
};

// Enviar mensagem e obter resposta
export const sendMessage = async (userMessage: string): Promise<string> => {
  try {
    const response = await cohereApi.chat(userMessage);
    return response;
  } catch (error) {
    console.error("Erro ao comunicar com a API da Cohere:", error);
    throw error;
  }
};

// Stream de respostas para melhor experiência de usuário
export const streamChatResponse = async (
  userMessage: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
): Promise<void> => {
  try {
    let fullResponse = "";

    // Configurar callbacks para processar stream
    const handleChunk = (chunk: string) => {
      fullResponse += chunk;
      onChunk(chunk);
    };

    const handleComplete = async () => {
      onComplete();
    };

    // Iniciar o stream
    await cohereApi.chatStream(userMessage, handleChunk, handleComplete);
  } catch (error) {
    console.error("Erro ao processar stream da Cohere:", error);
    throw error;
  }
};

// Limitar histórico de chat (evitar excesso de tokens)
export const trimChatHistory = (maxMessages: number = 6): void => {
  cohereApi.trimHistory(maxMessages);
};

// Obter histórico de conversa atual
export const getCurrentChatHistory = () => {
  return cohereApi.getHistory();
};

