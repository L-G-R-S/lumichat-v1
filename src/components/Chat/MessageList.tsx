
import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import ChatMessage from "../ChatMessage";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="flex-1 pt-0 md:pt-6 px-4 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-4 pb-16">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            type={message.type}
            content={message.content}
            isLoading={message.pending}
          />
        ))}
        
        {isLoading && !messages.some(m => m.pending) && (
          <ChatMessage
            type="bot"
            content=""
            isLoading={true}
          />
        )}

        <div ref={messagesEndRef} className="h-8" />
      </div>
    </div>
  );
};

export default MessageList;
