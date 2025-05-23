
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
        // Typing - reduced from 100 to 30 ms for faster typing
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.substring(0, displayText.length + 1));
          timer = setTimeout(type, 30);
        } else {
          // Reached end of phrase, pause before starting to delete
          timer = setTimeout(() => {
            setIsDeleting(true);
            type();
          }, 1200);
        }
      } else {
        // Deleting - reduced from 50 to 20 ms for faster deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.substring(0, displayText.length - 1));
          timer = setTimeout(type, 20);
        } else {
          // Finished deleting, switch to next phrase
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          timer = setTimeout(type, 200);
        }
      }
    };

    // Start the animation
    timer = setTimeout(type, 200);
    
    // Clear the timer when the component is unmounted
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

