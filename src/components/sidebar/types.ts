
export interface SidebarProps {
  onNewChat: () => void;
  onClearHistory: () => void;
  onDeleteConversation?: (id: string) => void;
  conversations: { id: string; title: string }[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}
