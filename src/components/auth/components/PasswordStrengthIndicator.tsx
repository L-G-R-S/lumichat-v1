
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  strength: number;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  strength
}) => {
  const getPasswordStrengthColor = () => {
    if (strength === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span>Força da senha:</span>
        <span>
          {strength === 0 && "Muito fraca"}
          {strength === 1 && "Fraca"}
          {strength === 2 && "Média"}
          {strength === 3 && "Boa"}
          {strength === 4 && "Forte"}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
          style={{ width: `${strength * 25}%` }}
        ></div>
      </div>
      
      <ul className="text-xs space-y-1 mt-2 text-muted-foreground">
        <li className={`flex items-center gap-1 ${password.length >= 8 ? 'text-success' : ''}`}>
          {password.length >= 8 ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-3 w-3">•</span>}
          Mínimo de 8 caracteres
        </li>
        <li className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-success' : ''}`}>
          {/[A-Z]/.test(password) ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-3 w-3">•</span>}
          Uma letra maiúscula
        </li>
        <li className={`flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-success' : ''}`}>
          {/[0-9]/.test(password) ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-3 w-3">•</span>}
          Um número
        </li>
        <li className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-success' : ''}`}>
          {/[^A-Za-z0-9]/.test(password) ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-3 w-3">•</span>}
          Um caractere especial
        </li>
      </ul>
    </div>
  );
};
