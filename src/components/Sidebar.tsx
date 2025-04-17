
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelLeftClose, MessageSquarePlus, Trash2, Bot, Settings, Sun, Moon, X, Plus, History, InfoIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNewChat: () => void;
  onClearHistory: () => void;
  onDeleteConversation?: (id: string) => void;
  conversations: { id: string; title: string }[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Sidebar = ({
  onNewChat,
  onClearHistory,
  onDeleteConversation,
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

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevents triggering the conversation selection
    if (onDeleteConversation) {
      onDeleteConversation(id);
      toast.success("Conversa excluída com sucesso");
    }
  };

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
      <div 
        className={cn(
          "h-full bg-sidebar border-r overflow-hidden",
          isActuallyCollapsed ? "-translate-x-full" : "translate-x-0",
          "transition-transform duration-300 ease-in-out"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">LumiChat</h1>
          </div>

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
                <div 
                  key={conversation.id}
                  className="flex group items-center"
                >
                  <Button
                    variant={activeConversation === conversation.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-sm font-normal truncate pr-8 relative",
                      activeConversation === conversation.id ? "bg-secondary/80" : "hover:bg-secondary/40"
                    )}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <MessageSquarePlus className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">{conversation.title}</span>
                    
                    {onDeleteConversation && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteClick(e, conversation.id)}
                        aria-label="Excluir conversa"
                      >
                        <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </Button>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Separator className="my-4" />
          
          <div className="space-y-1">
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
              className="w-full justify-start mb-2"
            >
              <InfoIcon className="mr-2 h-4 w-4" />
              <span>Sobre o LumiChat</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10"
              onClick={onClearHistory}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Limpar Histórico</span>
            </Button>
          </div>
          
          <div className="mt-auto pt-4">
            <div className="text-xs text-muted-foreground text-center">
              <p>LumiChat v1.0</p>
              <p className="mt-1">© 2025 Luis Guilherme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
