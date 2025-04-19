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
    const typingDelay = 100;
    const deletingDelay = 50;
    const pauseDelay = 1000;
    
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
    <div className="min-h-[24px] flex items-center justify-center py-2">
      <p className="text-lg text-primary/90 font-mono">
        {displayText}
        <span className="typing-cursor ml-0.5 -mb-0.5 inline-block"></span>
      </p>
    </div>
  );
};
