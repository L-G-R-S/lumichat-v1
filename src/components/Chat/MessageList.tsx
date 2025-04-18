
import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import ChatMessage from "../ChatMessage";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para o final da lista quando chegarem novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="flex-1 pt-4 md:pt-6 pb-28 md:pb-32 overflow-auto">
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

      <div ref={messagesEndRef} className="h-16 md:h-24" />
    </div>
  );
};

export default MessageList;
