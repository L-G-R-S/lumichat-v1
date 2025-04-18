
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
    <div className="flex-1 flex flex-col w-full overflow-auto min-h-[100dvh] max-w-[100vw]">
      <div className="flex-1 pt-16 md:pt-4">
        {showWelcome ? (
          <WelcomeScreen onSampleQuestionClick={onSendMessage} />
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md pt-2 md:pt-4 pb-4 md:pb-6 border-t border-border/50 w-full">
        <div className="max-w-3xl mx-auto px-4">
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
