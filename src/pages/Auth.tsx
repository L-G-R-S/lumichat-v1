
import React, { useState } from 'react';
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
import { Sun, Moon } from "lucide-react";

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { isDarkMode, toggleDarkMode } = useThemeToggle();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      switch (mode) {
        case 'login':
          const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
          if (loginError) throw loginError;
          break;
        case 'signup':
          const { error: signupError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
          if (signupError) throw signupError;
          break;
        case 'reset':
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
          if (resetError) throw resetError;
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

  return (
    <div className="min-h-screen grid lg:grid-cols-2 px-4 py-8 md:px-8 lg:px-16 xl:px-24">
      <AuthSidebar />
      
      <div className="flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            className="text-muted-foreground hover:text-foreground z-10"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="w-full max-w-md space-y-8">
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
            <div className="mt-8 lg:hidden">
              <AuthFeatures />
            </div>
          )}
          
          <AuthFooter />
        </div>
      </div>
    </div>
  );
};

export default Auth;
