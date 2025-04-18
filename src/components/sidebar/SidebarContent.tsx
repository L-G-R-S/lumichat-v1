
import { Button } from "@/components/ui/button";
import { Plus, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SidebarItem from "@/components/SidebarItem";
import SidebarHeader from "./SidebarHeader";
import SidebarActions from "./SidebarActions";
import SidebarFooter from "./SidebarFooter";
import { toast } from "sonner";

interface SidebarContentProps {
  onNewChat: () => void;
  onClearHistory: () => void;
  conversations: { id: string; title: string }[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  setIsAboutOpen: (open: boolean) => void;
}

const SidebarContent = ({
  onNewChat,
  onClearHistory,
  conversations,
  activeConversation,
  onSelectConversation,
  onDeleteConversation,
  toggleDarkMode,
  isDarkMode,
  setIsSettingsOpen,
  setIsAboutOpen
}: SidebarContentProps) => {
  const handleDeleteConversation = (id: string) => {
    if (onDeleteConversation) {
      onDeleteConversation(id);
      toast.success("Conversa excluída com sucesso");
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <SidebarHeader />

      <Button 
        onClick={onNewChat} 
        className="mb-6 gap-2 shadow-sm"
        variant="default"
      >
        <Plus className="h-4 w-4" />
        Nova Conversa
      </Button>

      {conversations.length > 0 && (
        <div className="flex-1 overflow-y-auto mb-4 space-y-1 pr-1">
          <div className="flex items-center mb-2 px-2">
            <History className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-xs font-medium text-muted-foreground">Histórico de conversas</span>
          </div>
          
          {conversations.map((conversation) => (
            <SidebarItem
              key={conversation.id}
              id={conversation.id}
              title={conversation.title}
              isActive={activeConversation === conversation.id}
              onSelect={onSelectConversation}
              onDelete={onDeleteConversation ? handleDeleteConversation : undefined}
            />
          ))}
        </div>
      )}

      <Separator className="my-4" />
      
      <SidebarActions
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        onClearHistory={onClearHistory}
        setIsSettingsOpen={setIsSettingsOpen}
        setIsAboutOpen={setIsAboutOpen}
      />
      
      <SidebarFooter />
    </div>
  );
};

export default SidebarContent;
