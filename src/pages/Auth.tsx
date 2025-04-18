
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogIn, UserPlus, RefreshCw } from "lucide-react";

type AuthMode = 'login' | 'signup' | 'reset';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      if (error) throw error;
      toast.success('Cadastro realizado com sucesso! Verifique seu e-mail.');
    } catch (error: any) {
      toast.error(error.message || 'Erro no cadastro');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password'
      });
      if (error) throw error;
      toast.success('E-mail de recuperação enviado!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar e-mail de recuperação');
    } finally {
      setLoading(false);
    }
  };

  const renderAuthForm = () => {
    switch (mode) {
      case 'login':
        return (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
                placeholder="********"
              />
            </div>
            <div className="flex justify-between items-center">
              <Button type="submit" disabled={loading}>
                <LogIn className="mr-2" /> Entrar
              </Button>
              <Button 
                type="button" 
                variant="link" 
                onClick={() => setMode('reset')}
              >
                Esqueci minha senha
              </Button>
            </div>
            <div className="text-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setMode('signup')}
              >
                Criar conta
              </Button>
            </div>
          </form>
        );
      case 'signup':
        return (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input 
                type="text" 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                required 
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
                placeholder="********"
                minLength={6}
              />
            </div>
            <div className="flex justify-between items-center">
              <Button type="submit" disabled={loading}>
                <UserPlus className="mr-2" /> Cadastrar
              </Button>
            </div>
            <div className="text-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setMode('login')}
              >
                Já tenho uma conta
              </Button>
            </div>
          </form>
        );
      case 'reset':
        return (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail para recuperação</Label>
              <Input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="seu@email.com"
              />
            </div>
            <div className="flex justify-between items-center">
              <Button type="submit" disabled={loading}>
                <RefreshCw className="mr-2" /> Recuperar Senha
              </Button>
            </div>
            <div className="text-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setMode('login')}
              >
                Voltar para Login
              </Button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">LumiChat</h1>
          <p className="text-muted-foreground">
            {mode === 'login' && 'Faça login para continuar'}
            {mode === 'signup' && 'Crie sua conta'}
            {mode === 'reset' && 'Recupere sua senha'}
          </p>
        </div>
        {renderAuthForm()}
      </div>
    </div>
  );
};

export default Auth;
