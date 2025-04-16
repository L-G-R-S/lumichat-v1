
import React from "react";
import { Bot, Search, Lightbulb, Sparkles } from "lucide-react";

const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 max-w-3xl mx-auto text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
        <Bot className="h-8 w-8 text-primary" />
      </div>
      
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        LumiChat
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8">
        Sua assistente de IA para qualquer tipo de pergunta
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
        <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-3">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-1">Pesquisa Inteligente</h3>
          <p className="text-sm text-muted-foreground text-center">
            Obtenha respostas detalhadas para suas perguntas mais complexas.
          </p>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-3">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-1">Ideias Criativas</h3>
          <p className="text-sm text-muted-foreground text-center">
            Explore soluções inovadoras e novas perspectivas para seus problemas.
          </p>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-1">Assistência</h3>
          <p className="text-sm text-muted-foreground text-center">
            Ajuda em tarefas cotidianas, desde sugestões até resumos de conteúdo.
          </p>
        </div>
      </div>
      
      <div className="w-full">
        <div className="text-sm text-center text-muted-foreground mb-3">
          Experimente perguntar:
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <button className="p-3 text-sm text-left border rounded-lg hover:bg-accent transition-colors">
            Explique como funcionam os buracos negros
          </button>
          <button className="p-3 text-sm text-left border rounded-lg hover:bg-accent transition-colors">
            Quais são os benefícios da meditação?
          </button>
          <button className="p-3 text-sm text-left border rounded-lg hover:bg-accent transition-colors">
            Crie uma lista de exercícios para melhorar a postura
          </button>
          <button className="p-3 text-sm text-left border rounded-lg hover:bg-accent transition-colors">
            Quais são as tendências de tecnologia para 2025?
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
