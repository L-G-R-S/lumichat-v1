import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthModeSwitcher } from "@/components/auth/AuthModeSwitcher";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthFeatures } from "@/components/auth/AuthFeatures";
import { Button } from "@/components/ui/button";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { AuthMode } from "@/components/auth/types";
import { Sun, Moon, Bot } from "lucide-react";

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  const { isDarkMode, toggleDarkMode } = useThemeToggle();
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      switch (mode) {
        case 'login':
          const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
          if (loginError) throw loginError;
          toast.success("Login realizado com sucesso", {
            description: "Redirecionando para o dashboard..."
          });
          break;
        case 'signup':
          const { error: signupError } = await supabase.auth.signUp({ 
            email, 
            password, 
            options: { data: { full_name: fullName } } 
          });
          if (signupError) throw signupError;
          toast.success("Cadastro realizado com sucesso", {
            description: "Verifique seu e-mail para confirmar sua conta."
          });
          break;
        case 'reset':
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
          if (resetError) throw resetError;
          toast.success("Email de recuperação enviado", {
            description: "Verifique sua caixa de entrada para redefinir sua senha."
          });
          break;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Erro de autenticação', {
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado'
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Bot className="w-12 h-12 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthSidebar />
      
      <div className="flex flex-col items-center justify-center p-6 lg:p-12 relative animate-fade-in">
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9"
            aria-label={isDarkMode ? "Alternar para modo claro" : "Alternar para modo escuro"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="flex items-center justify-center mb-8 lg:hidden">
          <Bot className="h-10 w-10 mr-3 text-primary" />
          <h1 className="text-3xl font-bold text-gradient">LumiChat</h1>
        </div>
        
        <div className="w-full max-w-md glass-card p-8 space-y-8">
          <AuthForm
            mode={mode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            fullName={fullName}
            setFullName={setFullName}
            loading={loading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onSubmit={handleSubmit}
          />
          
          <AuthModeSwitcher mode={mode} setMode={setMode} />
          
          {isMobile && (
            <div className="mt-8 pt-6 border-t border-border lg:hidden">
              <AuthFeatures />
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <AuthFooter />
        </div>
      </div>
    </div>
  );
};

export default Auth;
