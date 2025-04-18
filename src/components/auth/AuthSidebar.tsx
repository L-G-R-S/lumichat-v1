
import React from 'react';
import { BrainCircuit, Sun, Moon } from "lucide-react";
import { AuthFeatures } from "./AuthFeatures";
import { Button } from "@/components/ui/button";
import { useThemeToggle } from "@/hooks/useThemeToggle";

export const AuthSidebar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeToggle();

  return (
    <div className="hidden lg:flex flex-col p-8 bg-sidebar space-y-12 relative">
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleDarkMode}
          className="text-muted-foreground hover:text-foreground"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">LumiChat</h1>
        </div>
        <h2 className="text-2xl font-semibold text-primary">
          Sua assistente de IA pessoal
        </h2>
        <p className="text-muted-foreground max-w-md">
          Entre para a comunidade LumiChat e tenha acesso a uma assistente de IA avançada que aprende com suas interações e mantém todo seu histórico seguro.
        </p>
      </div>
      <AuthFeatures />
    </div>
  );
};
