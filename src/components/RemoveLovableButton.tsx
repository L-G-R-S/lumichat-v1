
import { useEffect } from 'react';

const RemoveLovableButton = () => {
  useEffect(() => {
    // Função para remover elementos do Lovable
    const removeLovableElements = () => {
      const selectors = [
        '#lovable-edit-button',
        'div[id*="lovable"]',
        'div[class*="lovable"]',
        'div[id*="gptengineer"]',
        'div[class*="gptengineer"]'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.remove();
        });
      });
    };

    // Remover imediatamente
    removeLovableElements();
    
    // Remover após um pequeno atraso para garantir que elementos carregados posteriormente também sejam removidos
    setTimeout(removeLovableElements, 500);
    setTimeout(removeLovableElements, 1500);
    
    // Configurar um MutationObserver para detectar novos elementos
    const observer = new MutationObserver(() => {
      removeLovableElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};

export default RemoveLovableButton;
