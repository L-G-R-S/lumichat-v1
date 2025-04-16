
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

export async function initConversation(): Promise<string> {
  try {
    const response = await fetch("https://messaging.botpress.cloud/v1/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CLIENT_ID}`
      },
      body: JSON.stringify({ botId: BOT_ID })
    });

    if (!response.ok) {
      throw new Error(`Erro na inicialização da conversa: ${response.status}`);
    }

    const data = await response.json();
    currentConversationId = data.id;
    console.log("Conversa iniciada com ID:", currentConversationId);
    return currentConversationId;
  } catch (error) {
    console.error("Erro ao iniciar conversa com Botpress:", error);
    throw error;
  }
}

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
      throw new Error(`Erro ao enviar mensagem: ${response.status}`);
    }

    console.log("Mensagem enviada com sucesso ao Botpress");
  } catch (error) {
    console.error("Erro ao enviar mensagem para Botpress:", error);
    throw error;
  }
}

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
      throw new Error(`Erro ao buscar mensagens: ${response.status}`);
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
