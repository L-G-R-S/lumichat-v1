
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, BrainCircuit, Loader2, CheckCircle2, Lock, Mail, User } from "lucide-react";

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

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

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
    <form onSubmit={onSubmit} className="space-y-6 animate-scale-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <BrainCircuit className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gradient mb-1">
          {getFormTitle()}
        </h1>
        <p className="text-sm text-muted-foreground">
          {getFormDescription()}
        </p>
      </div>
      
      {mode === 'signup' && (
        <div className="space-y-2">
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
            className="bg-background/50"
            aria-required="true"
            autoComplete="name"
          />
        </div>
      )}
      
      <div className="space-y-2">
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
          className="bg-background/50"
          aria-required="true"
          autoComplete={mode === 'login' ? "username" : mode === 'signup' ? "email" : "email"}
          aria-invalid={email && !/^\S+@\S+\.\S+$/.test(email) ? "true" : "false"}
        />
        {email && !/^\S+@\S+\.\S+$/.test(email) && (
          <p className="text-xs text-destructive mt-1">Por favor, insira um e-mail válido</p>
        )}
      </div>

      {mode !== 'reset' && (
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
              onChange={handlePasswordChange}
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
          
          {mode === 'signup' && password && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Força da senha:</span>
                <span>
                  {passwordStrength === 0 && "Muito fraca"}
                  {passwordStrength === 1 && "Fraca"}
                  {passwordStrength === 2 && "Média"}
                  {passwordStrength === 3 && "Boa"}
                  {passwordStrength === 4 && "Forte"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                  style={{ width: `${passwordStrength * 25}%` }}
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
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full btn-primary-glow mt-6 relative overflow-hidden group"
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
