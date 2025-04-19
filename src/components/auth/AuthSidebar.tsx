
import React from 'react';
import { Bot } from "lucide-react";
import { TypingEffect } from "./components/TypingEffect";

export const AuthSidebar: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)] from-primary/20 to-transparent dark:from-primary/10"></div>
      
      <div className="relative z-10 text-center space-y-8 max-w-sm w-full px-4 py-8">
        <div className="flex justify-center mb-2">
          <div className="p-4 rounded-full bg-primary/10 dark:bg-primary/20 float-element">
            <Bot className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gradient animate-fade-in">LumiChat</h1>
          <h2 className="text-2xl font-semibold text-primary/80 dark:text-primary/90">
            Sua assistente de IA pessoal
          </h2>
          
          <div className="h-16 flex items-center justify-center">
            <TypingEffect />
          </div>

          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Uma IA pronta para conversar com você.
          </p>
        </div>
      </div>
    </div>
  );
};

