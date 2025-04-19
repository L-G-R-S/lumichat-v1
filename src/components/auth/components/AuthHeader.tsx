
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
    <div className="text-center mb-6 md:mb-8">
      <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 mb-4 mx-auto">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="h-6 w-6 md:h-7 md:w-7 text-primary"
          aria-hidden="true"
        >
          <path d="M12 8V4H8"></path>
          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
          <path d="M2 14h2"></path>
          <path d="M20 14h2"></path>
          <path d="M15 13v2"></path>
          <path d="M9 13v2"></path>
        </svg>
      </div>
      <h1 className="text-xl md:text-2xl font-bold text-gradient mb-1">
        {getFormTitle()}
      </h1>
      <p className="text-sm text-muted-foreground mx-auto max-w-[250px] md:max-w-xs">
        {getFormDescription()}
      </p>
    </div>
  );
};
