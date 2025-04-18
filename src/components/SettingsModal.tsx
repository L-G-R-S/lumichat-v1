
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [userName, setUserName] = useState(""); // Add state for user name

  const handleUpdateData = () => {
    if (!userName.trim()) {
      toast.error("Por favor, insira um nome válido");
      return;
    }
    // Here you would typically update the user name in your backend
    toast.success("Nome atualizado com sucesso!");
  };

  const handleLogout = () => {
    // Implement logout logic here
    toast.success("Desconectado com sucesso!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Configurações</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Digite seu nome"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleUpdateData}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Atualizar nome
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
