
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

// Inicializa a conversa com o Botpress
export async function initConversation(): Promise<string> {
  try {
    // Tentativa direta à API do Botpress
    const response = await fetch("https://messaging.botpress.cloud/v1/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CLIENT_ID}`
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
    
    // Se for erro de CORS, vamos precisar informar o usuário
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.log("Possível erro de CORS detectado ao tentar conectar com a API do Botpress");
      throw new Error("Erro de CORS: Não é possível conectar diretamente à API do Botpress do navegador.");
    }
    
    throw error;
  }
}

// Envia mensagem para o Botpress
export async function sendMessage(message: string): Promise<void> {
  if (!currentConversationId) {
    await initConversation();
  }

  try {
    const response = await fetch("https://messaging.botpress.cloud/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CLIENT_ID}`
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
    throw error;
  }
}

// Busca a resposta do Botpress
export async function fetchBotResponse(): Promise<string> {
  if (!currentConversationId) {
    throw new Error("Sem conversação ativa. Inicie uma conversa primeiro.");
  }

  try {
    const response = await fetch(`https://messaging.botpress.cloud/v1/conversations/${currentConversationId}/messages`, {
      headers: {
        "Authorization": `Bearer ${CLIENT_ID}`
      }
    });

    if (!response.ok) {
      throw new Error(`Botpress API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.messages || data.messages.length === 0) {
      return "Sem resposta do bot.";
    }

    // Filtra apenas mensagens do bot e pega a mais recente
    const botMessages = data.messages.filter((msg: BotpressMessage) => msg.role === "bot");
    
    if (botMessages.length === 0) {
      return "Aguardando resposta do assistente...";
    }
    
    const latestBotMessage = botMessages[botMessages.length - 1];
    return latestBotMessage.payload.text || "Sem conteúdo na resposta.";
  } catch (error) {
    console.error("Erro ao buscar resposta do Botpress:", error);
    throw error;
  }
}

// Verificar status de conexão com a API
export async function checkBotpressConnection(): Promise<boolean> {
  try {
    await fetch("https://messaging.botpress.cloud/v1/status", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${CLIENT_ID}`
      }
    });
    return true;
  } catch (error) {
    console.error("Erro ao verificar conexão com Botpress:", error);
    return false;
  }
}
