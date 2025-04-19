
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, User } from "lucide-react";
import { AuthHeader } from './components/AuthHeader';
import { PasswordField } from './components/PasswordField';
import { PasswordStrengthIndicator } from './components/PasswordStrengthIndicator';

interface AuthFormProps {
  mode: 'login' | 'signup' | 'reset';
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  loading,
  showPassword,
  setShowPassword,
  onSubmit
}) => {
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (mode === 'signup' && newPassword) {
      checkPasswordStrength(newPassword);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 md:space-y-6 animate-scale-in w-full max-w-sm mx-auto">
      <AuthHeader mode={mode} />
      
      {mode === 'signup' && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center" htmlFor="fullName">
            <User className="w-4 h-4 mr-2 text-muted-foreground" />
            Nome completo
          </label>
          <Input
            id="fullName"
            placeholder="Seu nome completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="bg-background/50 text-base md:text-sm"
            aria-required="true"
            autoComplete="name"
          />
        </div>
      )}
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium flex items-center" htmlFor="email">
          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background/50 text-base md:text-sm"
          aria-required="true"
          autoComplete={mode === 'login' ? "username" : "email"}
          aria-invalid={email && !/^\S+@\S+\.\S+$/.test(email) ? "true" : "false"}
        />
        {email && !/^\S+@\S+\.\S+$/.test(email) && (
          <p className="text-xs text-destructive mt-1">Por favor, insira um e-mail válido</p>
        )}
      </div>

      {mode !== 'reset' && (
        <>
          <PasswordField
            password={password}
            onChange={handlePasswordChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            mode={mode}
          />
          
          {mode === 'signup' && password && (
            <PasswordStrengthIndicator
              password={password}
              strength={passwordStrength}
            />
          )}
        </>
      )}

      <Button
        type="submit"
        className="w-full btn-primary-glow mt-6 h-12 md:h-10 text-base md:text-sm relative overflow-hidden group"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Cadastrar' : 'Enviar e-mail'}
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </>
        )}
      </Button>
    </form>
  );
};
