
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { AuthForm } from "@/components/auth/AuthForm";

type AuthMode = 'login' | 'signup' | 'reset';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login realizado com sucesso!');
      navigate('/');
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
        options: { data: { full_name: fullName } }
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

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <AuthSidebar />
      
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {mode === 'login' ? 'Bem-vindo de volta' : mode === 'signup' ? 'Criar conta' : 'Recuperar senha'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? 'Entre para continuar usando o LumiChat' : 
               mode === 'signup' ? 'Crie sua conta para começar' : 
               'Digite seu e-mail para recuperar sua senha'}
            </p>
          </div>

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
            onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handlePasswordReset}
          />

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

          <div className="text-center text-xs text-muted-foreground">
            © 2025 LumiChat. Todos os direitos reservados.
            <div className="mt-1 space-x-1">
              <a href="#" className="hover:underline">Termos de Uso</a>
              <span>·</span>
              <a href="#" className="hover:underline">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
