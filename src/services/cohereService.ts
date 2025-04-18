
import { supabase } from "@/integrations/supabase/client";
import { cohereApi } from "./cohereApi";
import { Database } from "@/integrations/supabase/types";

// Define the chat message type to match our database schema
type ChatMessage = Database['public']['Tables']['chat_messages']['Insert'];

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
    // Armazenar mensagem do usuário no Supabase
    await supabase.from('chat_messages').insert({
      user_id: null,
      type: 'user',
      content: userMessage
    });

    // Obter resposta do Cohere
    const response = await cohereApi.chat(userMessage);
    
    // Armazenar resposta no Supabase
    await supabase.from('chat_messages').insert({
      user_id: null,
      type: 'bot',
      content: response
    });
    
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
    // Armazenar mensagem do usuário no Supabase
    await supabase.from('chat_messages').insert({
      user_id: null,
      type: 'user',
      content: userMessage
    });

    let fullResponse = "";

    // Configurar callbacks para processar stream
    const handleChunk = (chunk: string) => {
      fullResponse += chunk;
      onChunk(chunk);
    };

    const handleComplete = async () => {
      // Armazenar resposta completa no Supabase
      await supabase.from('chat_messages').insert({
        user_id: null,
        type: 'bot',
        content: fullResponse
      });
      
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

// Obter histórico de mensagens do Supabase
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

// Obter histórico de conversa atual
export const getCurrentChatHistory = () => {
  return cohereApi.getHistory();
};
