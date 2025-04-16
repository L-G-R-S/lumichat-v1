
import { Message } from "@/hooks/useChat";
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

  return (
    <div className="flex-1 flex flex-col overflow-auto min-h-screen bg-background">
      {showWelcome ? (
        <WelcomeScreen onSampleQuestionClick={onSendMessage} />
      ) : (
        <div className="flex-1 pt-6 pb-32 overflow-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={{
                role: message.type === "user" ? "user" : "assistant",
                content: message.content
              }}
            />
          ))}
          
          {isLoading && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "",
                pending: true
              }}
            />
          )}
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border/50 pt-4 pb-4 lg:pl-[280px]">
        <div className="max-w-3xl mx-auto px-4">
          <ChatInput
            onSendMessage={onSendMessage}
            isLoading={isLoading}
          />
          <p className="text-xs text-center text-muted-foreground mt-2">
            LumiChat AI com tecnologia Cohere pode produzir informações incorretas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
