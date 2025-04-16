
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

// Função para detector idioma (simplificada)
function detectLanguage(text: string): string {
  // Lista de palavras comuns em português
  const ptWords = ['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 
                  'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi',
                  'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito',
                  'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso',
                  'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem',
                  'nas', 'me', 'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num',
                  'nem', 'suas', 'meu', 'às', 'minha', 'têm', 'numa', 'pelos', 'elas', 'havia',
                  'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles', 'essas', 'esses',
                  'pelas', 'este', 'fosse', 'dele', 'tu', 'te', 'vocês', 'vos', 'lhes', 'meus',
                  'minhas', 'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa', 'nossos', 'nossas',
                  'dela', 'delas', 'esta', 'estes', 'estas', 'aquele', 'aquela', 'aqueles',
                  'aquelas', 'isto', 'aquilo', 'estou', 'está', 'estamos', 'estão', 'estive',
                  'esteve', 'estivemos', 'estiveram', 'estava', 'estávamos', 'estavam', 'estivera',
                  'estivéramos', 'esteja', 'estejamos', 'estejam', 'estivesse', 'estivéssemos',
                  'estivessem', 'estiver', 'estivermos', 'estiverem'];

  // Lista de palavras comuns em inglês
  const enWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for',
                  'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by',
                  'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one',
                  'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
                  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no',
                  'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some',
                  'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come',
                  'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
                  'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
                  'give', 'day', 'most', 'us'];

  // Preparar o texto para análise (remover pontuação, converter para minúsculas)
  const cleanText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  const words = cleanText.split(/\s+/);
  
  let ptCount = 0;
  let enCount = 0;
  
  // Contar ocorrências de palavras em cada idioma
  words.forEach(word => {
    if (ptWords.includes(word)) ptCount++;
    if (enWords.includes(word)) enCount++;
  });
  
  // Se não encontrar nenhuma palavra nas listas, verificar caracteres específicos do português
  if (ptCount === 0 && enCount === 0) {
    const ptChars = ['ç', 'á', 'à', 'â', 'ã', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú'];
    for (const char of ptChars) {
      if (text.toLowerCase().includes(char)) return 'pt';
    }
  }
  
  // Com prioridade para português - mesmo se for igual, retorna português
  return (ptCount >= enCount) ? 'pt' : 'en';
}

// Função para adicionar instruções sobre o idioma ao prompt
export function enhancePromptWithExtraContext(originalPrompt: string): string {
  const detectedLanguage = detectLanguage(originalPrompt);
  const languageInstruction = detectedLanguage === 'pt' 
    ? "Responda em português do Brasil. O usuário está falando em português, então mantenha suas respostas em português brasileiro, com linguagem natural e fluida."
    : "The user is writing in English. Please respond in English, but if you recognize Portuguese words or phrases, consider responding in Portuguese instead.";
  
  return `${languageInstruction}\n\n${EXTRA_CONTEXT}\n\nContexto original do usuário:\n${originalPrompt}`;
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
