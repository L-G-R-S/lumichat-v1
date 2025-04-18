
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  PanelLeft, 
  PanelLeftClose, 
  Plus, 
  Trash2, 
  Bot, 
  Settings, 
  Sun, 
  Moon, 
  History, 
  InfoIcon,
  Menu
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SettingsModal } from "./SettingsModal";
import { AboutDialog } from "./AboutDialog";
import SidebarItem from "./SidebarItem";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const isActuallyCollapsed = isMobile ? true : isCollapsed;

  const handleDeleteConversation = (id: string) => {
    if (onDeleteConversation) {
      onDeleteConversation(id);
      toast.success("Conversa excluída com sucesso");
    }
  };

  const SidebarContent = () => (
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
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start mb-2"
          onClick={() => setIsAboutOpen(true)}
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
  );

  // Versão mobile usa Sheet component
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-3 left-3 z-50 lg:hidden"
          aria-label="Menu"
        >
          <SheetTrigger asChild>
            <Menu size={24} />
          </SheetTrigger>
        </Button>
        
        <Sheet>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Versão desktop
  return (
    <div className={cn(
      "fixed top-0 left-0 z-40 h-full transition-all duration-300",
      isActuallyCollapsed ? "w-0" : "w-[280px]"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-3 right-0 translate-x-full z-40 bg-background border border-l-0 rounded-l-none h-9 w-9",
          "lg:top-4 lg:h-10 lg:w-10"
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isActuallyCollapsed ? "Abrir sidebar" : "Fechar sidebar"}
      >
        {isActuallyCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
      </Button>

      <div 
        className={cn(
          "h-full bg-sidebar border-r overflow-hidden",
          isActuallyCollapsed ? "-translate-x-full" : "translate-x-0",
          "transition-transform duration-300 ease-in-out"
        )}
      >
        <SidebarContent />
      </div>

      <SettingsModal 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
      <AboutDialog
        open={isAboutOpen}
        onOpenChange={setIsAboutOpen}
      />
    </div>
  );
};

export default Sidebar;
