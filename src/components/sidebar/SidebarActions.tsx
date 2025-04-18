
import { Button } from "@/components/ui/button";
import { Sun, Moon, Settings, InfoIcon, Trash2 } from "lucide-react";

interface SidebarActionsProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  onClearHistory: () => void;
  setIsSettingsOpen: (open: boolean) => void;
  setIsAboutOpen: (open: boolean) => void;
}

const SidebarActions = ({
  toggleDarkMode,
  isDarkMode,
  onClearHistory,
  setIsSettingsOpen,
  setIsAboutOpen
}: SidebarActionsProps) => {
  return (
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
  );
};

export default SidebarActions;
