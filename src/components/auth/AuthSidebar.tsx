
import React from 'react';
import { Bot, MessageSquare, Shield } from "lucide-react";
import { AuthFeatures } from "./AuthFeatures";

export const AuthSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col justify-center min-h-screen bg-sidebar px-6 md:px-12 lg:px-24">
      <div className="max-w-xl mx-auto w-full space-y-16">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary">LumiChat</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-primary">
              Sua assistente de IA pessoal
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              Entre para a comunidade LumiChat e tenha acesso a uma assistente de IA avançada que aprende com suas interações e mantém todo seu histórico seguro.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-primary/10 shrink-0">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-primary">IA Inteligente</h3>
              <p className="text-sm text-muted-foreground">
                Tecnologia Cohere avançada para respostas precisas
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-primary/10 shrink-0">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-primary">Histórico Salvo</h3>
              <p className="text-sm text-muted-foreground">
                Suas conversas são salvas na sua conta
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-primary/10 shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-primary">Dados Seguros</h3>
              <p className="text-sm text-muted-foreground">
                Suas informações estão protegidas com segurança
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

