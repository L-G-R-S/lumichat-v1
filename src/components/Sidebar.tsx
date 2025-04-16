
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelLeftClose, MessageSquarePlus, Trash2, Bot, Settings, Sun, Moon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  onNewChat: () => void;
  onClearHistory: () => void;
  conversations: { id: string; title: string }[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Sidebar = ({
  onNewChat,
  onClearHistory,
  conversations,
  activeConversation,
  onSelectConversation,
  toggleDarkMode,
  isDarkMode,
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // Automatically collapse sidebar on mobile
  const isActuallyCollapsed = isMobile ? true : isCollapsed;

  return (
    <div className={`fixed top-0 left-0 z-30 h-full transition-all duration-300 ${
      isActuallyCollapsed ? "w-0" : "w-[280px]"
    }`}>
      {/* Toggle button (always visible) */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-0 translate-x-full z-30 bg-background border border-l-0 rounded-l-none h-10 w-10"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isActuallyCollapsed ? "Abrir sidebar" : "Fechar sidebar"}
      >
        {isActuallyCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
      </Button>

      {/* Main sidebar content */}
      <div className={`h-full bg-sidebar border-r overflow-hidden ${
        isActuallyCollapsed ? "-translate-x-full" : "translate-x-0"
      } transition-transform duration-300`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">LumiChat</h1>
          </div>

          <Button 
            onClick={onNewChat} 
            className="mb-4"
            variant="default"
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Nova Conversa
          </Button>

          {conversations.length > 0 && (
            <div className="flex-1 overflow-y-auto mb-4 space-y-1">
              {conversations.map((conversation) => (
                <Button
                  key={conversation.id}
                  variant={activeConversation === conversation.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm font-normal truncate"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <MessageSquarePlus className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">{conversation.title}</span>
                </Button>
              ))}
            </div>
          )}

          <Separator className="mb-4" />
          
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start" 
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Modo Escuro</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/10"
              onClick={onClearHistory}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Limpar Histórico</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
