
import React from 'react';
import { BrainCircuit, MessageSquare, Shield } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: 'IA Inteligente',
    description: 'Tecnologia Cohere avançada para respostas precisas'
  },
  {
    icon: MessageSquare,
    title: 'Histórico Salvo',
    description: 'Suas conversas são salvas na sua conta'
  },
  {
    icon: Shield,
    title: 'Dados Seguros',
    description: 'Suas informações estão protegidas com segurança'
  }
];

export const AuthFeatures: React.FC = () => {
  return (
    <div className="space-y-8">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-primary/10">
            <feature.icon className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-primary">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
