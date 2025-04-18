
import React from 'react';
import { AuthMode } from './types';

interface AuthModeSwitcherProps {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
}

export const AuthModeSwitcher: React.FC<AuthModeSwitcherProps> = ({ mode, setMode }) => {
  return (
    <div className="space-y-4 text-center text-sm">
      {mode === 'login' && (
        <>
          <button
            type="button"
            onClick={() => setMode('reset')}
            className="text-sm text-primary hover:underline"
          >
            Esqueceu sua senha?
          </button>
          <div>
            Não tem uma conta?{" "}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-primary hover:underline font-medium"
            >
              Cadastre-se
            </button>
          </div>
        </>
      )}

      {mode === 'signup' && (
        <div>
          Já tem uma conta?{" "}
          <button
            type="button"
            onClick={() => setMode('login')}
            className="text-primary hover:underline font-medium"
          >
            Entrar
          </button>
        </div>
      )}

      {mode === 'reset' && (
        <button
          type="button"
          onClick={() => setMode('login')}
          className="text-primary hover:underline font-medium"
        >
          Voltar para login
        </button>
      )}
    </div>
  );
};
