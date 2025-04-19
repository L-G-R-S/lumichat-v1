
import React from 'react';
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordFieldProps {
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  mode: 'login' | 'signup';
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  password,
  onChange,
  showPassword,
  setShowPassword,
  mode
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center" htmlFor="password">
        <Lock className="w-4 h-4 mr-2 text-muted-foreground" />
        Senha
      </label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={onChange}
          required
          className="bg-background/50 pr-10"
          aria-required="true"
          autoComplete={mode === 'login' ? "current-password" : "new-password"}
          minLength={mode === 'signup' ? 8 : undefined}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-full"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};
