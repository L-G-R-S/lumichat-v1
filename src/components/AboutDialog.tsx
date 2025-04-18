
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Bot } from "lucide-react";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Bot className="h-5 w-5 text-primary" />
            Sobre o LumiChat
          </DialogTitle>
          <DialogDescription className="text-left space-y-4 pt-4">
            <p>
              O LumiChat é um assistente de IA avançado que utiliza a tecnologia Cohere 
              para fornecer respostas precisas e naturais em português brasileiro.
            </p>
            <p>
              Desenvolvido para ser intuitivo e eficiente, o LumiChat oferece:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Respostas em tempo real com streaming</li>
              <li>Suporte a upload de arquivos e imagens</li>
              <li>Interface adaptável (tema claro/escuro)</li>
              <li>Histórico de conversas</li>
            </ul>
            <p className="text-sm text-muted-foreground pt-2">
              Versão 1.0 • Desenvolvido por Luis Guilherme
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
