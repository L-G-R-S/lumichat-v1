
import { CohereClient } from "cohere-ai";
import { generateUUID } from "@/utils/uuid";

// Classe para gerenciar a API do Cohere
export class CohereApi {
  private client: CohereClient;
  private chatHistory: Array<{ role: "USER" | "CHATBOT"; message: string }> = [];
  private sessionId: string | null = null;
  private systemPreamble: string;

  constructor(apiKey: string) {
    this.client = new CohereClient({
      token: apiKey,
    });
    this.systemPreamble = `Você é o Lumichat, um assistente simpático criado por Luis Guilherme. 
    Seja conciso e direto nas respostas.`;
    this.sessionId = generateUUID();
  }

  // Inicializa ou reinicia uma conversa
  public resetSession(): string {
    this.chatHistory = [];
    this.sessionId = generateUUID();
    return this.sessionId;
  }

  // Envia uma mensagem e obtém resposta
  public async chat(message: string): Promise<string> {
    try {
      const response = await this.client.chat({
        model: "command-a-03-2025",
        temperature: 0.2,
        message: message,
        preamble: this.systemPreamble,
        chatHistory: this.chatHistory.length > 0 ? this.chatHistory : undefined,
        maxTokens: 500,
      });
      
      // Adiciona à histórico de chat
      this.chatHistory.push({
        role: "USER",
        message: message
      });
      
      if (response.text) {
        this.chatHistory.push({
          role: "CHATBOT",
          message: response.text
        });
      }
      
      return response.text || "Desculpe, não consegui processar sua solicitação.";
    } catch (error) {
      console.error("Erro ao comunicar com a API da Cohere:", error);
      throw error;
    }
  }

  // Obtém resposta em stream para experiência melhor
  public async chatStream(
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void
  ): Promise<void> {
    try {
      // Adiciona mensagem do usuário ao histórico
      this.chatHistory.push({
        role: "USER",
        message: message
      });

      let fullResponse = "";

      // Obtém stream da resposta
      const stream = await this.client.chatStream({
        model: "command-a-03-2025",
        temperature: 0.2,
        message: message,
        preamble: this.systemPreamble,
        chatHistory: this.chatHistory.length > 0 ? this.chatHistory : undefined,
        maxTokens: 500,
      });

      // Processa cada pedaço do stream
      for await (const chunk of stream) {
        if (chunk.eventType === "text-generation") {
          fullResponse += chunk.text;
          onChunk(chunk.text);
        }
      }

      // Adiciona resposta ao histórico
      this.chatHistory.push({
        role: "CHATBOT",
        message: fullResponse
      });

      // Sinaliza conclusão
      onComplete();
    } catch (error) {
      console.error("Erro ao processar stream da Cohere:", error);
      throw error;
    }
  }

  // Limita o histórico para evitar excesso de tokens
  public trimHistory(maxMessagesCount: number = 6): void {
    if (this.chatHistory.length > maxMessagesCount) {
      this.chatHistory = this.chatHistory.slice(this.chatHistory.length - maxMessagesCount);
    }
  }

  // Retorna histórico atual
  public getHistory(): Array<{ role: "USER" | "CHATBOT"; message: string }> {
    return [...this.chatHistory];
  }
}

// Instância singleton para uso em toda a aplicação
const COHERE_API_KEY = "phPQaSdkrQWbgvYxBfJfVS15GRBrMkUTgyHQmIXq";
export const cohereApi = new CohereApi(COHERE_API_KEY);
