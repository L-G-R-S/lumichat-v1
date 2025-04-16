/**
 * Cohere API service
 * Handles communication with the Cohere API for chat functionalities
 */

const COHERE_API_KEY = "GVzEDDuMb62mmw2WzFxtjDrY6aEDEavRdKtO2P4b";
const API_URL = "https://api.cohere.ai/v1/generate";

// Texto adicional com explicações sobre recursos extras
const EXTRA_CONTEXT = `
Excelente ponto, Higor!

Sim, se no seu chat original (como esse mostrado na imagem) aparecem botões como:

- 📎 **Anexar arquivos (.PDF, .TXT)**
- 🧠 **Python Interpreter**
- 🧮 **Calculator**
- 🌐 **Web Search**

Isso significa que esse sistema (provavelmente OpenAI Playground, Hugging Face ou outro custom) está com **recursos extras ativados** por trás — mas **isso não faz parte do Cohere diretamente**.

## 🔎 Importante entender:
A **API da Cohere** **não interpreta arquivos PDF, imagens ou faz busca na web nativamente**. Ela é uma API de **geração de texto pura**.

Essas funções adicionais (como interpretar arquivos, rodar cálculos ou buscar na web) precisam ser implementadas no **backend do seu projeto**.
`;

// Função para adicionar o contexto extra ao prompt do usuário
export function enhancePromptWithExtraContext(originalPrompt: string): string {
  return `${EXTRA_CONTEXT}\n\nContexto original do usuário:\n${originalPrompt}`;
}

// Initialize a conversation
export async function initConversation(): Promise<string> {
  // No initialization needed for Cohere, but returning a conversation ID for consistency
  return `cohere-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// Send message to Cohere and get response
export async function sendMessage(message: string): Promise<string> {
  try {
    console.log("Enviando mensagem para a Cohere:", message);
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",
        prompt: message,
        max_tokens: 300,
        temperature: 0.8,
        k: 0,
        stop_sequences: [],
        return_likelihoods: "NONE"
      })
    });

    if (!response.ok) {
      throw new Error(`Cohere API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.generations && data.generations.length > 0) {
      const botResponse = data.generations[0].text.trim();
      console.log("Resposta da Cohere:", botResponse);
      return botResponse;
    } else {
      console.error("Resposta da Cohere não contém gerações:", data);
      return "Desculpe, não consegui gerar uma resposta.";
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem para a Cohere:", error);
    throw error;
  }
}

// No separate fetch needed for Cohere as the response is returned directly from sendMessage
export async function fetchBotResponse(): Promise<string> {
  // This function isn't needed for Cohere implementation but kept for API compatibility
  return ""; // This will never be called as we modified the useMessageHandling hook
}

// Check connection with Cohere API
export async function checkConnection(): Promise<boolean> {
  try {
    // Simple connection test - send a basic prompt
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",
        prompt: "Hello",
        max_tokens: 5,
        temperature: 0.8,
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error("Erro ao verificar conexão com Cohere:", error);
    return false;
  }
}
