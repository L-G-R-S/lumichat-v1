
export interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}
