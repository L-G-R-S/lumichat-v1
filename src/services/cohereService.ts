
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

// Store conversation chat history
let chatHistory: Message[] = [];
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
    await supabase.from('messages').insert({
      session_id: currentSessionId,
      role: 'user',
      content: userMessage
    });

    // Get response from Cohere with lower temperature para respostas mais rápidas
    const response = await client.chat({
      model: "command-a-03-2025",
      temperature: 0.2, // Reduzido para respostas mais determinísticas e rápidas
      message: userMessage,
      preamble: systemPreamble,
      chatHistory: chatHistory.length > 0 ? chatHistory : undefined,
      maxTokens: 500, // Limitando o tamanho da resposta para maior velocidade
    });
    
    // Store bot response in Supabase
    await supabase.from('messages').insert({
      session_id: currentSessionId,
      role: 'assistant',
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

// Adicionar função para limitar histórico de chat (evita excesso de tokens)
export const trimChatHistory = () => {
  // Manter apenas as últimas 6 mensagens (3 interações) para manter o contexto essencial
  if (chatHistory.length > 6) {
    chatHistory = chatHistory.slice(chatHistory.length - 6);
  }
};

// Função para recuperar histórico de mensagens de uma sessão
export const getSessionHistory = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao recuperar histórico de mensagens:', error);
    return [];
  }

  return data || [];
};

