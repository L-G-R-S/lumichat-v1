
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
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">LumiChat</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearConversation}
          disabled={!hasMessages || isLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar conversa
        </Button>
      </div>
    </div>
  );
};

export default LumiChatHeader;
