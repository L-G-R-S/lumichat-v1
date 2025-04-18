
import React from 'react';

export const AuthFooter: React.FC = () => {
  return (
    <div className="text-center text-xs text-muted-foreground">
      © 2025 LumiChat. Todos os direitos reservados.
      <div className="mt-1 space-x-1">
        <a href="#" className="hover:underline">Termos de Uso</a>
        <span>·</span>
        <a href="#" className="hover:underline">Política de Privacidade</a>
      </div>
    </div>
  );
};
