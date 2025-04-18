import { useState } from "react";
import { Menu, PanelLeft, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SettingsModal } from "./SettingsModal";
import { AboutDialog } from "./AboutDialog";
import { cn } from "@/lib/utils";
import SidebarContent from "./sidebar/SidebarContent";
import type { SidebarProps } from "./sidebar/types";

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

  const sidebarContentProps = {
    onNewChat,
    onClearHistory,
    onDeleteConversation,
    conversations,
    activeConversation,
    onSelectConversation,
    toggleDarkMode,
    isDarkMode,
    setIsSettingsOpen,
    setIsAboutOpen
  };

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
            <SidebarContent {...sidebarContentProps} />
          </SheetContent>
        </Sheet>

        <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        <AboutDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} />
      </>
    );
  }

  return (
    <>
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
          <SidebarContent {...sidebarContentProps} />
        </div>
      </div>

      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <AboutDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} />
    </>
  );
};

export default Sidebar;
