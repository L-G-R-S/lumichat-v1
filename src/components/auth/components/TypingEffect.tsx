
import React, { useState, useEffect } from 'react';

const phrases = [
  "Converse com sua IA pessoal",
  "Receba respostas em segundos",
  "Seu histórico sempre disponível"
];

export const TypingEffect: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    const type = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (!isDeleting) {
        // Digitando - reduzido de 100 para 70ms
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.substring(0, displayText.length + 1));
          timer = setTimeout(type, 70);
        } else {
          // Chegou ao final da frase, pausa antes de começar a deletar
          timer = setTimeout(() => {
            setIsDeleting(true);
            type();
          }, 1200);
        }
      } else {
        // Deletando - reduzido de 50 para 30ms
        if (displayText.length > 0) {
          setDisplayText(displayText.substring(0, displayText.length - 1));
          timer = setTimeout(type, 30);
        } else {
          // Terminou de deletar, muda para a próxima frase
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          timer = setTimeout(type, 200);
        }
      }
    };

    // Inicie a animação
    timer = setTimeout(type, 200);
    
    // Limpar o timer quando o componente for desmontado
    return () => {
      clearTimeout(timer);
    };
  }, [displayText, currentPhraseIndex, isDeleting]);

  return (
    <div className="flex items-center justify-center py-2 h-full">
      <p className="text-lg text-primary/90 font-mono leading-relaxed">
        {displayText}
        <span className="typing-cursor ml-0.5 inline-block" aria-hidden="true"></span>
      </p>
    </div>
  );
};
