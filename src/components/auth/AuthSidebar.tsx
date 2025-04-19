
import React from 'react';
import { Bot } from "lucide-react";
import { TypingEffect } from "./components/TypingEffect";

export const AuthSidebar: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 md:px-12 lg:px-24 w-full max-w-3xl mx-auto">
      {/* Logo e Título */}
      <div className="text-center space-y-8 mb-8">
        <div className="relative float-element inline-flex items-center gap-4 mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-purple-600/40 rounded-full opacity-75 blur-xl"></div>
          <div className="p-3 rounded-full bg-primary/10 relative z-10">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary relative z-10">LumiChat</h1>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">
            Sua assistente de IA pessoal
          </h2>
          <TypingEffect />
          <p className="text-base text-muted-foreground max-w-md mx-auto">
            Entre para a comunidade LumiChat e tenha acesso a uma assistente de IA avançada que aprende com suas interações.
          </p>
        </div>
      </div>
    </div>
  );
};
