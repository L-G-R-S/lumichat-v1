
import { Message } from "@/hooks/useChat";
import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  apiKey: string;
  onApiKeySubmit: (key: string) => void;
}

const ChatArea = ({ messages, isLoading, onSendMessage }: ChatAreaProps) => {
  const showWelcome = messages.length === 0;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col overflow-auto min-h-screen">
      {showWelcome ? (
        <WelcomeScreen onSampleQuestionClick={onSendMessage} />
      ) : (
        <div className="flex-1 pt-6 pb-32 overflow-auto">
          {messages.map((message) => (
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

          <div ref={messagesEndRef} className="h-24" /> {/* Adiciona um espaço extra para evitar sobreposição */}
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md pt-4 pb-6 lg:pl-[280px] border-t border-border/50">
        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatArea;
