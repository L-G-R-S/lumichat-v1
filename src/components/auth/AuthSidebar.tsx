
import React from 'react';
import { BrainCircuit } from "lucide-react";
import { AuthFeatures } from "./AuthFeatures";

export const AuthSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col p-12 bg-sidebar space-y-16 relative">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-10 w-10 text-primary">
            <path d="M12 8V4H8"></path>
            <rect width="16" height="12" x="4" y="8" rx="2"></rect>
            <path d="M2 14h2"></path>
            <path d="M20 14h2"></path>
            <path d="M15 13v2"></path>
            <path d="M9 13v2"></path>
          </svg>
          <h1 className="text-4xl font-bold text-primary">LumiChat</h1>
        </div>
        <h2 className="text-3xl font-semibold text-primary mt-4">
          Sua assistente de IA pessoal
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mt-4">
          Entre para a comunidade LumiChat e tenha acesso a uma assistente de IA avançada que aprende com suas interações e mantém todo seu histórico seguro.
        </p>
      </div>
      <AuthFeatures />
    </div>
  );
};
