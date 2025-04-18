
import React from "react";
import { MessageSquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  id: string;
  title: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  title,
  isActive,
  onSelect,
  onDelete
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="flex group items-center">
      <div
        className={cn(
          "flex items-center w-full rounded-md py-2 px-3 text-sm font-normal cursor-pointer truncate",
          isActive 
            ? "bg-secondary/80 text-foreground" 
            : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
        )}
        onClick={() => onSelect(id)}
      >
        <MessageSquarePlus className="mr-2 h-4 w-4 shrink-0" />
        <span className="truncate">{title}</span>
      </div>
      
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDeleteClick}
          aria-label="Excluir conversa"
        >
          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
        </Button>
      )}
    </div>
  );
};

export default SidebarItem;
