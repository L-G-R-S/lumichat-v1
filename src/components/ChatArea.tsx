
import { Message } from "@/types/chat";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import MessageList from "./Chat/MessageList";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  apiKey?: string;
  onApiKeySubmit?: (key: string) => void;
}

const ChatArea = ({ messages, isLoading, onSendMessage }: ChatAreaProps) => {
  const showWelcome = messages.length === 0;

  return (
    <div className="relative flex-1 flex flex-col w-full">
      {/* Main content area with improved centering */}
      <div className="flex-1 flex justify-center w-full max-w-[100vw] overflow-x-hidden">
        <div className="w-full max-w-3xl px-4 md:px-8 pt-16 md:pt-8 pb-32">
          {showWelcome ? (
            <WelcomeScreen onSampleQuestionClick={onSendMessage} />
          ) : (
            <MessageList messages={messages} isLoading={isLoading} />
          )}
        </div>
      </div>
      
      {/* Input area with proper alignment and glass effect */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md pt-4 pb-6 border-t border-border/50">
        <div className="w-full max-w-3xl mx-auto px-4 md:px-8">
          <ChatInput
            onSendMessage={onSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
