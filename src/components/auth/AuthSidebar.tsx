
import React from 'react';
import { BrainCircuit } from "lucide-react";
import { AuthFeatures } from "./AuthFeatures";

export const AuthSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col p-12 bg-sidebar space-y-16 relative">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-10 w-10 text-primary" />
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
