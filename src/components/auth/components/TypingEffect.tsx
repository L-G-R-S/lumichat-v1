
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
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    // Configurações otimizadas para uma animação mais suave
    const typingDelay = 80; // Um pouco mais rápido
    const deletingDelay = 40; // Um pouco mais rápido
    const pauseDelay = 1200; // Pausa mais longa no final da frase
    
    // Função principal de animação de digitação
    const type = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (isPaused) {
        // Se estiver pausado, espere e então comece a deletar
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDelay);
        return;
      }
      
      if (!isDeleting) {
        // Digitando
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        } else {
          // Chegou ao final da frase, pausar antes de começar a deletar
          setIsPaused(true);
          return; // Importante: retorne para não agendar outro timeout
        }
      } else {
        // Deletando
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          // Terminou de deletar, mude para a próxima frase
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }

      // Agende o próximo frame
      const nextDelay = isDeleting ? deletingDelay : typingDelay;
      setTimeout(type, nextDelay);
    };

    // Inicie a animação
    const timer = !isPaused ? setTimeout(type, isDeleting ? deletingDelay : typingDelay) : null;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [displayText, currentPhraseIndex, isDeleting, isPaused]);

  return (
    <div className="flex items-center justify-center py-2 h-full">
      <p className="text-lg text-primary/90 font-mono leading-relaxed">
        {displayText}
        <span className="typing-cursor ml-0.5 inline-block" aria-hidden="true"></span>
      </p>
    </div>
  );
};
