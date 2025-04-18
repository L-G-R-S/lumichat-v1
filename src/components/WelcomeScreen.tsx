
import React from "react";
import { Bot, MessageSquare, HelpCircle, Sparkles, Zap, Brain } from "lucide-react";
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

  const features = [
    { icon: Sparkles, title: "Respostas inteligentes", color: "from-purple-400 to-indigo-500" },
    { icon: Zap, title: "Rápido e eficiente", color: "from-amber-400 to-orange-500" },
    { icon: Brain, title: "Aprende com você", color: "from-blue-400 to-cyan-500" },
  ];

  const displayQuestions = isMobile 
    ? sampleQuestions.slice(0, 2) 
    : sampleQuestions;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 md:py-16 max-w-3xl mx-auto text-center pb-20 md:pb-[200px] animate-fade-in">
      {/* Hero section with floating animation */}
      <div className="relative float-element">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full opacity-75 blur-xl"></div>
        <div className="flex items-center justify-center w-20 md:w-28 h-20 md:h-28 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 mb-6 relative z-10 shadow-glow">
          <Bot className="h-10 w-10 md:h-14 md:w-14 text-primary" />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 md:mb-4 text-gradient-animated">
        LumiChat
      </h1>
      
      <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-md leading-relaxed">
        Sua assistente de IA inteligente para conversas naturais e intuitivas.
      </p>

      {/* Feature badges */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 md:mb-16">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10"
          >
            <feature.icon className={cn(
              "h-3.5 w-3.5 text-transparent bg-clip-text bg-gradient-to-br", 
              feature.color
            )} />
            <span className="text-xs font-medium">{feature.title}</span>
          </div>
        ))}
      </div>
      
      {/* Sample questions */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center mb-5">
          <MessageSquare className="h-4 w-4 md:h-5 md:w-5 mr-2 text-primary" />
          <h2 className="text-base md:text-lg font-medium">Experimente perguntar</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {displayQuestions.map((question, index) => (
            <Button 
              key={index} 
              variant="outline"
              className="p-4 text-sm text-left justify-start h-auto font-normal rounded-xl border
                shadow-sm hover:shadow-md hover:bg-primary/5 hover:border-primary/30 hover:scale-[1.02]
                transition-all overflow-hidden group"
              onClick={() => onSampleQuestionClick(question)}
            >
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-1.5 mr-3 group-hover:bg-primary/20 transition-colors">
                  <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                </div>
                <span className="truncate">{question}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center mt-8 md:mt-16 text-xs text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
        <p>Para melhores resultados, seja claro e específico em suas perguntas</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
