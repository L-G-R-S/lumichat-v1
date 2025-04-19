
import React from 'react';
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
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-7 w-7 text-primary">
          <path d="M12 8V4H8"></path>
          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
          <path d="M2 14h2"></path>
          <path d="M20 14h2"></path>
          <path d="M15 13v2"></path>
          <path d="M9 13v2"></path>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gradient mb-1">
        {getFormTitle()}
      </h1>
      <p className="text-sm text-muted-foreground">
        {getFormDescription()}
      </p>
    </div>
  );
};
