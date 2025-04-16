
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquarePlus, 
  Trash2, 
  Settings, 
  Sun, 
  Moon, 
  MessageSquare, 
  X 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
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
    e.stopPropagation();
    if (onDeleteConversation) {
      onDeleteConversation(id);
    }
  };

  return (
    <div className={`h-full transition-all duration-300 ${
      isActuallyCollapsed ? "w-0" : "w-[280px]"
    }`}>
      {/* Main sidebar content */}
      <div className={`h-full border-r bg-sidebar overflow-hidden flex flex-col ${
        isActuallyCollapsed ? "-translate-x-full" : "translate-x-0"
      } transition-transform duration-300`}>
        {/* Logo & Title */}
        <div className="flex items-center gap-2 p-4">
          <div className="h-6 w-6 bg-primary/20 rounded-md flex items-center justify-center">
            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.25 9.75C5.25 7.68 6.925 6 9 6C10.4346 6 11.675 6.83929 12.2059 8.05592C12.6029 7.72373 13.1108 7.5 13.6667 7.5C14.8883 7.5 15.8333 8.44501 15.8333 9.66667C15.8333 9.94206 15.784 10.2049 15.694 10.4493C16.3477 10.5956 16.9115 10.9874 17.2627 11.55C17.614 12.1126 17.7173 12.7847 17.5478 13.4227C17.3782 14.0606 16.9502 14.6026 16.3685 14.9224C15.7868 15.2422 15.1037 15.314 14.4683 15.1221C13.8328 14.9302 13.2985 14.4909 12.9966 13.9016C12.6946 13.3124 12.6522 12.6244 12.8786 12C12.6532 12 12.4305 12.0333 12.225 12.0961C11.6902 12.2586 11.2315 12.5917 10.9236 13.0394C10.6158 13.4872 10.4753 14.0236 10.527 14.5539C10.5788 15.0841 10.8191 15.5768 11.2033 15.9456C11.5874 16.3144 12.0907 16.5355 12.625 16.5714C12.8743 16.5842 13.1242 16.5842 13.3734 16.5714C13.5482 16.5652 13.7229 16.6028 13.8805 16.6805C14.0381 16.7582 14.1739 16.8737 14.2764 17.0168C14.3788 17.1598 14.4448 17.3263 14.4692 17.501C14.4935 17.6757 14.4755 17.8535 14.4168 18.0194C14.3582 18.1854 14.2606 18.334 14.1323 18.4521C14.004 18.5703 13.849 18.6544 13.6807 18.6976C13.5125 18.7408 13.3361 18.7417 13.1675 18.7003C12.7275 18.659 12.2875 18.649 11.85 18.659C10.8854 18.6548 9.95268 18.3002 9.21336 17.6574C8.47404 17.0146 7.97814 16.1242 7.81798 15.1464C7.65782 14.1686 7.84369 13.1676 8.34453 12.3088C8.84538 11.45 9.62948 10.7864 10.55 10.4227C10.3728 10.1833 10.2187 9.93033 10.09 9.66667C9.81109 10.0456 9.42642 10.3344 8.98815 10.4964C8.54987 10.6584 8.07861 10.6864 7.62545 10.5771C7.17229 10.4677 6.75751 10.2249 6.43233 9.87851C6.10715 9.53214 5.88649 9.0976 5.8 8.63333C5.71344 8.16852 5.77191 7.68919 5.96693 7.26053C6.16195 6.83188 6.48376 6.4754 6.88842 6.23952C7.29308 6.00364 7.76229 5.89926 8.22684 5.94064C8.69139 5.98203 9.13086 6.16711 9.48667 6.47C9.40109 6.00582 9.47642 5.53124 9.70025 5.11643C9.92408 4.70162 10.2862 4.37273 10.7254 4.18333C11.1645 3.99393 11.6526 3.95624 12.1133 4.07631C12.574 4.19639 12.981 4.46758 13.2683 4.85C13.6508 4.5517 14.1136 4.37749 14.5972 4.34968C15.0809 4.32188 15.5616 4.44169 15.98 4.69333C16.2606 4.86732 16.4924 5.1173 16.6504 5.41639C16.8083 5.71548 16.8864 6.05257 16.8772 6.39333C16.8681 6.73409 16.7721 7.06686 16.598 7.35775C16.4238 7.64864 16.1784 7.88728 15.8883 8.04667C16.226 8.23 16.5173 8.48667 16.7333 8.8C17.155 8.56 17.6356 8.43324 18.1222 8.43333C18.4093 8.43333 18.6942 8.48027 18.9652 8.57177C19.2361 8.66328 19.4883 8.79777 19.7097 8.97C19.9311 9.14222 20.1177 9.34966 20.2614 9.58333C20.405 9.81701 20.5032 10.0738 20.5516 10.3417C20.6 10.6095 20.5978 10.8835 20.5452 11.1505C20.4926 11.4175 20.3903 11.6727 20.243 11.9042C20.0957 12.1357 19.906 12.3405 19.6823 12.5096C19.4586 12.6786 19.2049 12.8096 18.9333 12.8972C18.9843 13.0948 19.01 13.2975 19.01 13.5011C19.01 13.7047 18.9843 13.9073 18.9333 14.105C18.9333 14.105 19.55 14.1417 20.075 14.6333C20.6 15.125 20.8333 15.9 20.8333 15.9C20.8333 15.9 19.5333 16.0583 18.8333 15.4C18.4572 15.0455 18.2054 14.5957 18.1108 14.1119C18.0161 13.628 18.0817 13.1308 18.3 12.6833C18.4641 12.3528 18.6867 12.0547 18.9577 11.8042C19.2286 11.5537 19.5434 11.3551 19.8871 11.2182C20.2309 11.0813 20.5969 11.0081 20.9667 11.0022C21.3366 10.9963 21.7046 11.0578 22.0526 11.1836C22.9684 11.5382 23.65 12.3461 23.8504 13.3202C24.0509 14.2944 23.7428 15.2976 23.0333 16.025C22.7345 16.3413 22.3786 16.5981 21.985 16.7809C21.5915 16.9638 21.168 17.0693 20.7379 17.0916C20.3077 17.1139 19.8768 17.0525 19.4686 16.9111C19.0604 16.7696 18.6834 16.5503 18.3583 16.2667C18.1917 16.4333 18.0083 16.5833 17.8167 16.7167C17.8167 17.7333 17.3 18.5167 17.3 18.5167C17.3 18.5167 16.525 17.5417 16.7333 16.8333C16.7867 16.625 16.8833 16.4167 17 16.2167C16.8081 16.2989 16.6057 16.3531 16.3991 16.3778C16.1924 16.4024 15.9837 16.3972 15.7783 16.3623C15.3588 16.2914 14.9662 16.1196 14.6363 15.8628C14.3063 15.606 14.0488 15.2718 13.8872 14.8925C13.7256 14.5131 13.665 14.0997 13.711 13.6914C13.757 13.283 13.9082 12.8925 14.1505 12.5568C14.3929 12.2212 14.7189 11.9516 15.0965 11.7723C15.4742 11.593 15.8913 11.5093 16.3092 11.5299C16.7272 11.5505 17.1336 11.675 17.4907 11.8916C17.8478 12.1083 18.1439 12.4108 18.35 12.7733C18.6369 12.2912 18.743 11.7232 18.6483 11.1723C18.5537 10.6214 18.2638 10.1224 17.8293 9.76282C17.3949 9.40322 16.8443 9.20332 16.2801 9.19825C15.7159 9.19318 15.1618 9.38329 14.7213 9.73667C14.85 9.14333 14.8 8.6 14.6 8.17333C14.55 8.05333 14.4917 7.93333 14.425 7.82C14.0826 7.20648 13.5361 6.76102 12.8929 6.57303C12.2497 6.38504 11.5623 6.46903 10.9855 6.80728C10.4087 7.14553 9.9959 7.70794 9.84676 8.36208C9.69762 9.01622 9.8243 9.70133 10.1917 10.25C10.1345 10.3135 10.0799 10.3786 10.0273 10.4454C9.89106 10.2272 9.7127 10.0381 9.50276 9.88866C9.29281 9.73926 9.0551 9.63282 8.80402 9.5743C8.55293 9.51577 8.29273 9.50645 8.03818 9.54682C7.78362 9.58719 7.53929 9.67654 7.32 9.81C6.94667 10.1733 7.09 10.76 7.51667 10.96C7.66667 11.0267 7.84 11.06 8 11.06C8.71667 11.06 9.23 11.695 9.23 12.5C9.23 12.9093 9.07414 13.302 8.7966 13.5983C8.51906 13.8946 8.1415 14.0667 7.75 14.0833C6.63667 14.12 5.75 13.1883 5.75 12.0117C5.75 11.445 5.85333 11.1633 5.93 10.9467C5.45333 10.7533 5.25 10.2933 5.25 9.75Z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-foreground">LumiChat</h1>
        </div>
        
        {/* New Chat Button */}
        <div className="px-4 pb-4">
          <Button 
            onClick={onNewChat} 
            className="w-full"
            variant="default"
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Nova Conversa
          </Button>
        </div>
        
        {/* Conversation List */}
        {conversations.length > 0 && (
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id}
                className="flex group items-center"
              >
                <Button
                  variant={activeConversation === conversation.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-sm font-normal truncate pr-8 relative", 
                    activeConversation === conversation.id ? "bg-accent" : ""
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <MessageSquare className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">{conversation.title}</span>
                  
                  {onDeleteConversation && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteClick(e, conversation.id)}
                      aria-label="Excluir conversa"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Footer Actions */}
        <div className="mt-auto p-4 space-y-2">
          <Button 
            variant="outline" 
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
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-destructive hover:bg-destructive/10"
            onClick={onClearHistory}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Limpar Histórico</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
