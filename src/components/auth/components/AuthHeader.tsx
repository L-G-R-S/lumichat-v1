
import React from 'react';
import { Bot } from 'lucide-react';
import { AuthMode } from '../types';

interface AuthHeaderProps {
  mode: AuthMode;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ mode }) => {
  const getFormTitle = () => {
    switch (mode) {
      case 'login': return 'Bem-vindo de volta';
      case 'signup': return 'Crie sua conta';
      case 'reset': return 'Recuperar senha';
    }
  };

  const getFormDescription = () => {
    switch (mode) {
      case 'login': return 'Acesse sua conta para utilizar o LumiChat';
      case 'signup': return 'Junte-se à comunidade LumiChat';
      case 'reset': return 'Enviaremos um e-mail para redefinir sua senha';
    }
  };

  return (
    <div className="text-center mb-6 md:mb-8">
      <div className="relative flex justify-center items-center mb-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-purple-600/40 rounded-full opacity-75 blur-xl"></div>
        <div className="relative z-10 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center float-element">
          <Bot className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-primary mb-3 md:mb-4 animate-fade-in">
        LumiChat
      </h1>
      
      <p className="text-sm text-muted-foreground mx-auto max-w-[250px] md:max-w-xs">
        {getFormDescription()}
      </p>
    </div>
  );
};
