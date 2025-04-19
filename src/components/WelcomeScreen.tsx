import React from "react";
import { Bot, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface WelcomeScreenProps {
  onSampleQuestionClick: (question: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSampleQuestionClick }) => {
  const isMobile = useIsMobile();
  
  const sampleQuestions = [
    "Explique como funcionam os buracos negros",
    "Quais são os benefícios da meditação diária?",
    "Crie uma lista de exercícios para melhorar a postura",
    "Quais são as tendências de tecnologia para 2025?"
  ];

  const displayQuestions = isMobile ? sampleQuestions.slice(0, 2) : sampleQuestions;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="relative float-element mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-purple-600/40 rounded-full opacity-75 blur-xl"></div>
        <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-background/80 backdrop-blur-sm border border-primary/20 relative z-10 shadow-lg">
          <Bot className="h-8 w-8 md:h-10 md:w-10 text-primary" />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-primary mb-3 md:mb-4 text-center">
        LumiChat
      </h1>
      
      <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-lg text-center leading-relaxed">
        Assistente de IA para conversar com você.
      </p>

      <div className="w-full max-w-2xl mb-20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          <h2 className="text-base md:text-lg font-medium">Experimente perguntar</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {displayQuestions.map((question, index) => (
            <Button 
              key={index} 
              variant="outline"
              className="p-4 text-sm text-left justify-start h-auto min-h-[60px] font-normal rounded-xl border
                shadow-sm hover:shadow-md hover:bg-primary/5 hover:border-primary/30
                transition-all duration-200 ease-in-out group w-full"
              onClick={() => onSampleQuestionClick(question)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="bg-primary/10 rounded-full p-2 group-hover:bg-primary/20 transition-colors shrink-0">
                  <HelpCircle className="h-4 w-4 text-primary" />
                </div>
                <span className="line-clamp-2 text-sm leading-snug">{question}</span>
              </div>
            </Button>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 mt-2 md:mt-4 text-center">
          Para melhores resultados, seja claro e específico em suas perguntas
        </p>
      </div>
      
      <div className="fixed bottom-24 md:bottom-32 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/20 shadow-sm max-w-md mx-auto">
          Para melhores resultados, seja claro e específico em suas perguntas
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
