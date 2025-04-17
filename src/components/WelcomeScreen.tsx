
import React from "react";
import { Bot, Search, Lightbulb, Sparkles, MessageSquare, Book, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onSampleQuestionClick: (question: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSampleQuestionClick }) => {
  const sampleQuestions = [
    "Explique como funcionam os buracos negros",
    "Quais são os benefícios da meditação diária?",
    "Crie uma lista de exercícios para melhorar a postura",
    "Quais são as tendências de tecnologia para 2025?",
    "Quais etapas devo seguir para aprender programação?",
    "Explique o conceito de inteligência artificial generativa"
  ];

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 max-w-3xl mx-auto text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 shadow-sm">
        <Bot className="h-8 w-8 text-primary" />
      </div>
      
      <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
        LumiChat
      </h1>
      
      <p className="text-xl text-muted-foreground mb-10">
        Sua assistente de IA com tecnologia Cohere
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
        <div className="flex flex-col items-center p-5 bg-secondary/50 rounded-xl border border-border/50 hover:bg-secondary/70 transition-colors">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-3">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-1">Pesquisa Inteligente</h3>
          <p className="text-sm text-muted-foreground text-center">
            Obtenha respostas detalhadas para suas perguntas mais complexas.
          </p>
        </div>
        
        <div className="flex flex-col items-center p-5 bg-secondary/50 rounded-xl border border-border/50 hover:bg-secondary/70 transition-colors">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-3">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-1">Ideias Criativas</h3>
          <p className="text-sm text-muted-foreground text-center">
            Explore soluções inovadoras e novas perspectivas para seus problemas.
          </p>
        </div>
        
        <div className="flex flex-col items-center p-5 bg-secondary/50 rounded-xl border border-border/50 hover:bg-secondary/70 transition-colors">
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
        <div className="flex items-center justify-center mb-4">
          <MessageSquare className="h-4 w-4 mr-2 text-primary" />
          <h2 className="text-lg font-medium">Experimente perguntar</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleQuestions.map((question, index) => (
            <Button 
              key={index} 
              variant="outline"
              className="p-4 text-sm text-left justify-start h-auto font-normal rounded-xl border hover:bg-secondary/30 hover:border-primary/20 transition-all overflow-hidden"
              onClick={() => onSampleQuestionClick(question)}
            >
              <HelpCircle className="h-4 w-4 mr-2 text-primary/70 shrink-0" />
              <span className="truncate">{question}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center mt-12 text-xs text-muted-foreground">
        <Book className="h-3 w-3 mr-1.5" />
        <p>Para melhores resultados, seja claro e específico em suas perguntas</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
