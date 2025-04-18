
import { useEffect } from 'react';

const RemoveLovableButton = () => {
  useEffect(() => {
    // Função para remover elementos do Lovable
    const removeLovableElements = () => {
      const selectors = [
        '#lovable-edit-button',
        'div[id*="lovable"]',
        'div[class*="lovable"]',
        'div[id^="lovable"]',
        'div[class^="lovable"]',
        'button[id*="lovable"]',
        'button[class*="lovable"]',
        'div[id*="gptengineer"]',
        'div[class*="gptengineer"]',
        '[data-testid*="lovable"]',
        '[data-lovable]',
        '[id*="lovable"]',
        '[class*="lovable"]'
      ];
      
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            el.remove();
          });
        } catch (error) {
          console.log(`Erro ao remover ${selector}:`, error);
        }
      });

      // Remover qualquer iframe que possa estar carregando o botão
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.src && (iframe.src.includes('lovable') || iframe.src.includes('gptengineer'))) {
          iframe.remove();
        }
      });
    };

    // Remover imediatamente
    removeLovableElements();
    
    // Remover a cada intervalo curto por um período mais longo
    // para garantir que elementos carregados de forma assíncrona sejam capturados
    const intervals = [100, 500, 1000, 1500, 2000, 3000, 5000];
    intervals.forEach(time => {
      setTimeout(removeLovableElements, time);
    });
    
    // Remover continuamente a cada 2 segundos por 30 segundos
    const intervalId = setInterval(removeLovableElements, 2000);
    setTimeout(() => clearInterval(intervalId), 30000);
    
    // Configurar um MutationObserver para detectar novos elementos
    const observer = new MutationObserver((mutations) => {
      removeLovableElements();
      
      // Verificar especificamente por novos botões ou divs com "lovable" no nome
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node: Node) => {
            if (node instanceof HTMLElement) {
              const el = node as HTMLElement;
              if (
                el.id?.toLowerCase().includes('lovable') || 
                el.className?.toLowerCase().includes('lovable') ||
                el.outerHTML?.toLowerCase().includes('lovable')
              ) {
                el.remove();
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id', 'class']
    });
    
    return () => {
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default RemoveLovableButton;
