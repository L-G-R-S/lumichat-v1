
import React from 'react';
import { Bot } from "lucide-react";
import { TypingEffect } from "./components/TypingEffect";

export const AuthSidebar: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full lg:w-1/2 min-h-screen bg-primary/10 dark:bg-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)] from-primary/20 to-transparent dark:from-primary/10"></div>
      
      <div className="relative z-10 text-center space-y-6 max-w-xl px-6 md:px-12">
        <div className="inline-flex items-center gap-4 mb-2">
          <div className="p-4 rounded-full bg-primary/10 dark:bg-primary/20">
            <Bot className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gradient">LumiChat</h1>
          <h2 className="text-2xl font-semibold text-primary/80 dark:text-primary/90">
            Sua assistente de IA pessoal
          </h2>
          
          <div className="h-16">
            <TypingEffect />
          </div>

          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Uma IA pronta para conversar com você. Simples assim.
          </p>
        </div>
      </div>
    </div>
  );
};
