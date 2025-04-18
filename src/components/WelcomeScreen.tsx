
import React from "react";
import { Bot, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onSampleQuestionClick: (question: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSampleQuestionClick }) => {
  const sampleQuestions = [
    "Explique como funcionam os buracos negros",
    "Quais são os benefícios da meditação diária?",
    "Crie uma lista de exercícios para melhorar a postura",
    "Quais são as tendências de tecnologia para 2025?"
  ];

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 md:py-16 max-w-3xl mx-auto text-center pb-24 md:pb-[200px]">
      {/* Logo e título */}
      <div className="flex items-center justify-center w-16 md:w-20 h-16 md:h-20 rounded-full bg-primary/10 mb-4 md:mb-6">
        <Bot className="h-8 w-8 md:h-10 md:w-10 text-primary" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
        LumiChat
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground mb-10 md:mb-16 max-w-md">
        Sua assistente de IA inteligente.
      </p>
      
      {/* Sugestões de perguntas */}
      <div className="w-full">
        <div className="flex items-center justify-center mb-5">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
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
      
      <div className="flex items-center mt-8 md:mt-12 text-xs text-muted-foreground">
        <p>Para melhores resultados, seja claro e específico em suas perguntas</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
