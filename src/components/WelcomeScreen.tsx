
import React from "react";
import { Bot, Search, Lightbulb, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onSampleQuestionClick: (question: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSampleQuestionClick }) => {
  const sampleQuestions = [
    "Explique como funcionam os buracos negros",
    "Quais são os benefícios da meditação?",
    "Crie uma lista de exercícios para melhorar a postura",
    "Quais são as tendências de tecnologia para 2025?",
  ];

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 max-w-3xl mx-auto text-center h-full">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
        <Bot className="h-8 w-8 text-primary" />
      </div>
      
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        LumiChat
      </h1>
      
      <p className="text-xl text-muted-foreground mb-10">
        Sua assistente de IA com Cohere para qualquer tipo de pergunta
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
        <div className="flex flex-col items-center p-5 bg-muted/30 rounded-xl border border-border/50">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Pesquisa Inteligente</h3>
          <p className="text-sm text-muted-foreground text-center">
            Obtenha respostas detalhadas para suas perguntas mais complexas.
          </p>
        </div>
        
        <div className="flex flex-col items-center p-5 bg-muted/30 rounded-xl border border-border/50">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Ideias Criativas</h3>
          <p className="text-sm text-muted-foreground text-center">
            Explore soluções inovadoras e novas perspectivas para seus problemas.
          </p>
        </div>
        
        <div className="flex flex-col items-center p-5 bg-muted/30 rounded-xl border border-border/50">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Assistência</h3>
          <p className="text-sm text-muted-foreground text-center">
            Ajuda em tarefas cotidianas, desde sugestões até resumos de conteúdo.
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-2xl">
        <div className="text-sm text-center text-muted-foreground mb-3">
          Experimente perguntar:
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleQuestions.map((question, index) => (
            <button 
              key={index} 
              className="p-4 text-sm text-left border rounded-xl hover:bg-accent transition-colors"
              onClick={() => onSampleQuestionClick(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
