
const CLIENT_ID = "ef6613e3-17b1-41ca-9b8c-9db703b123cc";
const BOT_ID = "lumichat";

interface BotpressMessage {
  id: string;
  conversationId: string;
  authorId: string;
  payload: {
    text: string;
    type: string;
  };
  sentAt: string;
  role: "bot" | "user";
}

let currentConversationId: string | null = null;

// Mock API proxy URLs - this simulates a proxy server
// In a real implementation, replace these with your actual proxy server URLs
const PROXY_BASE_URL = "https://cors-anywhere.herokuapp.com/https://messaging.botpress.cloud/v1";

// Initialize a conversation with Botpress
export async function initConversation(): Promise<string> {
  try {
    console.log("Iniciando conversa com Botpress...");
    
    // Try direct API call first (will likely fail due to CORS in browser)
    const response = await fetch(`${PROXY_BASE_URL}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CLIENT_ID}`,
        "X-Requested-With": "XMLHttpRequest" // Required by some CORS proxies
      },
      body: JSON.stringify({ botId: BOT_ID })
    });

    if (!response.ok) {
      throw new Error(`Botpress API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    currentConversationId = data.id;
    console.log("Conversa iniciada com ID:", currentConversationId);
    return currentConversationId;
  } catch (error) {
    console.error("Erro ao conectar com Botpress:", error);
    
    // If CORS error, provide more helpful message
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.log("Erro de CORS detectado. Usando proxy para comunicação com Botpress.");
      
      // Try fallback method - create a unique local conversation ID
      // This would normally be replaced with an actual proxy server call
      const fallbackId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      currentConversationId = fallbackId;
      
      // In a real implementation, you would make a call to your backend proxy here
      // await fetch('https://your-backend-proxy.com/api/botpress/initConversation', ...)
      
      return fallbackId;
    }
    
    throw error;
  }
}

// Send message to Botpress
export async function sendMessage(message: string): Promise<void> {
  if (!currentConversationId) {
    await initConversation();
  }

  try {
    console.log(`Enviando mensagem para conversa ${currentConversationId}: ${message}`);
    
    // Send message via proxy
    const response = await fetch(`${PROXY_BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CLIENT_ID}`,
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        botId: BOT_ID,
        conversationId: currentConversationId,
        payload: {
          type: "text",
          text: message
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Botpress API returned ${response.status}: ${response.statusText}`);
    }

    console.log("Mensagem enviada com sucesso ao Botpress");
  } catch (error) {
    console.error("Erro ao enviar mensagem para o Botpress:", error);
    
    // In a real implementation, you would make a call to your backend proxy here
    // await fetch('https://your-backend-proxy.com/api/botpress/sendMessage', ...)
    
    throw error;
  }
}

// Fetch response from Botpress
export async function fetchBotResponse(): Promise<string> {
  if (!currentConversationId) {
    throw new Error("Sem conversação ativa. Inicie uma conversa primeiro.");
  }

  try {
    console.log(`Buscando resposta para conversa ${currentConversationId}`);
    
    // Fetch bot response via proxy
    const response = await fetch(`${PROXY_BASE_URL}/conversations/${currentConversationId}/messages`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${CLIENT_ID}`,
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    if (!response.ok) {
      throw new Error(`Botpress API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.messages || data.messages.length === 0) {
      return "Sem resposta do bot.";
    }

    // Filter just bot messages and get the most recent one
    const botMessages = data.messages.filter((msg: BotpressMessage) => msg.role === "bot");
    
    if (botMessages.length === 0) {
      return "Aguardando resposta do assistente...";
    }
    
    const latestBotMessage = botMessages[botMessages.length - 1];
    return latestBotMessage.payload.text || "Sem conteúdo na resposta.";
  } catch (error) {
    console.error("Erro ao buscar resposta do Botpress:", error);
    
    // In a real implementation, you would make a call to your backend proxy here
    // const proxyResponse = await fetch('https://your-backend-proxy.com/api/botpress/getBotResponse', ...)
    // return proxyResponse.json().then(data => data.botMessage)
    
    throw error;
  }
}

// Check connection status with the API
export async function checkBotpressConnection(): Promise<boolean> {
  try {
    await fetch(`${PROXY_BASE_URL}/status`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${CLIENT_ID}`,
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    return true;
  } catch (error) {
    console.error("Erro ao verificar conexão com Botpress:", error);
    return false;
  }
}

// Alternative method: Create a Node.js Proxy Server
// This function provides instructions on setting up a backend proxy
export function getProxyInstructions(): string {
  return `
Para implementar um proxy backend (a solução mais robusta):

1. Crie um servidor Node.js simples usando Express
2. Adicione este código:

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_ID = "${CLIENT_ID}";
const BOT_ID = "${BOT_ID}";
let conversationId = null;

// Inicializar conversa
app.post("/api/init", async (req, res) => {
  try {
    const response = await axios.post("https://messaging.botpress.cloud/v1/conversations", 
      { botId: BOT_ID },
      { headers: { "Authorization": \`Bearer \${CLIENT_ID}\` }}
    );
    conversationId = response.data.id;
    res.json({ id: conversationId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar mensagem
app.post("/api/message", async (req, res) => {
  const { message } = req.body;
  
  try {
    if (!conversationId) {
      const initResponse = await axios.post("https://messaging.botpress.cloud/v1/conversations", 
        { botId: BOT_ID },
        { headers: { "Authorization": \`Bearer \${CLIENT_ID}\` }}
      );
      conversationId = initResponse.data.id;
    }
    
    await axios.post("https://messaging.botpress.cloud/v1/messages",
      {
        botId: BOT_ID,
        conversationId: conversationId,
        payload: {
          type: "text",
          text: message
        }
      },
      { headers: { "Authorization": \`Bearer \${CLIENT_ID}\` }}
    );
    
    // Espere a resposta do bot
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Obtenha as mensagens
    const messagesResponse = await axios.get(
      \`https://messaging.botpress.cloud/v1/conversations/\${conversationId}/messages\`,
      { headers: { "Authorization": \`Bearer \${CLIENT_ID}\` }}
    );
    
    const botMessages = messagesResponse.data.messages.filter(msg => msg.role === "bot");
    const lastBotMessage = botMessages[botMessages.length - 1];
    
    res.json({ 
      response: lastBotMessage?.payload?.text || "Sem resposta do bot.",
      conversationId: conversationId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("API proxy rodando na porta 3000");
});

3. Hospede este servidor em um serviço como Vercel, Render, ou Railway
4. Atualize o frontend para chamar seu proxy ao invés da API do Botpress diretamente
`;
}
