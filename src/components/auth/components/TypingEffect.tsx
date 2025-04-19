
import React, { useState, useEffect } from 'react';

const phrases = [
  "Converse com sua IA pessoal",
  "Receba respostas inteligentes",
  "Tenha seu histórico salvo com segurança"
];

export const TypingEffect: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const typingDelay = 100; // Velocidade de digitação
    const deletingDelay = 50; // Velocidade de apagar
    const pauseDelay = 2000; // Pausa entre frases
    
    const type = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (!isDeleting) {
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
          setTimeout(type, typingDelay);
        } else {
          setTimeout(() => setIsDeleting(true), pauseDelay);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
          setTimeout(type, deletingDelay);
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    };

    const timer = setTimeout(type, isDeleting ? deletingDelay : typingDelay);
    return () => clearTimeout(timer);
  }, [displayText, currentPhraseIndex, isDeleting]);

  return (
    <div className="h-8 flex items-center justify-center">
      <p className="text-lg text-primary/80">
        {displayText}
        <span className="typing-cursor ml-1"></span>
      </p>
    </div>
  );
};
