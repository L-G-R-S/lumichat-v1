
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import { useToast } from "@/hooks/use-toast";

// Tipos para as mensagens e conversas
interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

// Algumas mensagens predefinidas para simular respostas da IA
const botResponses = [
  "Essa é uma excelente pergunta! Com base nas informações disponíveis, posso dizer que...",
  "Existem várias maneiras de abordar essa questão. Primeiramente, é importante considerar que...",
  "De acordo com as pesquisas mais recentes nessa área, os especialistas indicam que...",
  "Essa é uma questão complexa que envolve diversos fatores. Vamos analisar cada um deles...",
  "Entendo sua curiosidade sobre esse tema. A resposta curta é que depende do contexto, mas vou explicar em detalhes...",
  "Ótima pergunta! Isso é um tema fascinante que tem recebido muita atenção ultimamente...",
  "Do ponto de vista técnico, o processo funciona assim: primeiro, os dados são coletados e depois processados através de...",
  "Historicamente, esse conceito evoluiu bastante ao longo do tempo. Inicialmente...",
  "Existem prós e contras a serem considerados. Por um lado, temos os benefícios de... Por outro lado, os desafios incluem...",
  "Vamos dividir isso em partes para facilitar o entendimento. Primeiro vamos falar sobre...",
];

// Função para gerar um ID único
const generateId = () => Math.random().toString(36).substring(2, 11);

const Index = () => {
  // Estados
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  // Efeito para carregar o modo escuro da localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Alternar entre modo claro e escuro
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  // Obter a conversa atual
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  // Função para criar uma nova conversa
  const handleNewChat = () => {
    const newId = generateId();
    const newConversation: Conversation = {
      id: newId,
      title: `Nova Conversa`,
      messages: [],
    };
    
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newId);
  };

  // Função para limpar o histórico
  const handleClearHistory = () => {
    toast({
      title: "Histórico apagado",
      description: "Todas as conversas foram removidas.",
    });
    setConversations([]);
    setActiveConversationId(null);
  };

  // Função para enviar uma mensagem
  const handleSendMessage = (content: string) => {
    // Se não houver conversa ativa, criar uma nova
    if (!activeConversationId) {
      handleNewChat();
      return;
    }
    
    // Adicionar mensagem do usuário
    const messageId = generateId();
    const userMessage: Message = {
      id: messageId,
      type: "user",
      content,
    };
    
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          // Atualizar título com base na primeira mensagem
          const shouldUpdateTitle = conv.messages.length === 0;
          const newTitle = shouldUpdateTitle
            ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
            : conv.title;
            
          return {
            ...conv,
            title: newTitle,
            messages: [...conv.messages, userMessage],
          };
        }
        return conv;
      })
    );
    
    // Simular resposta da IA
    setIsLoading(true);
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage: Message = {
        id: generateId(),
        type: "bot",
        content: randomResponse,
      };
      
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, botMessage],
            };
          }
          return conv;
        })
      );
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
        conversations={conversations}
        activeConversation={activeConversationId}
        onSelectConversation={setActiveConversationId}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col pl-0 lg:pl-[280px]">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-auto min-h-screen">
          {/* No active conversation */}
          {!activeConversation && (
            <WelcomeScreen />
          )}
          
          {/* Active conversation */}
          {activeConversation && (
            <>
              <div className="flex-1 pt-4 pb-32 overflow-auto">
                {activeConversation.messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    type={message.type}
                    content={message.content}
                  />
                ))}
                
                {isLoading && (
                  <ChatMessage
                    type="bot"
                    content=""
                    isLoading={true}
                  />
                )}
              </div>
              
              {/* Chat input - fixed at bottom */}
              <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm pt-4 pb-4 lg:pl-[280px]">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
