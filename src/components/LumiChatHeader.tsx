
import React from "react";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Trash2 } from "lucide-react";

interface LumiChatHeaderProps {
  onClearConversation: () => void;
  hasMessages: boolean;
  isLoading: boolean;
}

const LumiChatHeader: React.FC<LumiChatHeaderProps> = ({
  onClearConversation,
  hasMessages,
  isLoading
}) => {
  return (
    <div className="flex items-center justify-between p-3 md:p-4 border-b">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        <h1 className="text-lg md:text-xl font-semibold">LumiChat</h1>
      </div>
      
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearConversation}
          disabled={!hasMessages || isLoading}
          className="text-xs md:text-sm"
        >
          <Trash2 className="h-4 w-4 mr-1.5 md:mr-2" />
          <span className="hidden sm:inline">Limpar conversa</span>
          <span className="sm:hidden">Limpar</span>
        </Button>
      </div>
    </div>
  );
};

export default LumiChatHeader;
