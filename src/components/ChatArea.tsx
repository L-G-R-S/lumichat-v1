
import { Message } from "@/hooks/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import ApiKeyInput from "./ApiKeyInput";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  apiKey: string;
  onApiKeySubmit: (key: string) => void;
}

const ChatArea = ({ messages, isLoading, onSendMessage, apiKey, onApiKeySubmit }: ChatAreaProps) => {
  const showWelcome = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col overflow-auto min-h-screen">
      {!apiKey && (
        <div className="mx-auto max-w-2xl w-full px-4 mt-4">
          <ApiKeyInput apiKey={apiKey} onApiKeySubmit={onApiKeySubmit} />
        </div>
      )}
      
      {showWelcome ? (
        <WelcomeScreen onSampleQuestionClick={onSendMessage} />
      ) : (
        <div className="flex-1 pt-4 pb-32 overflow-auto">
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
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm pt-4 pb-4 lg:pl-[280px]">
        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatArea;
