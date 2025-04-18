
import { useEffect } from 'react';

const RemoveLovableButton = () => {
  useEffect(() => {
    // Função para remover elementos do Lovable com segurança
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
          // Use querySelectorAll to get all matching elements
          const elements = document.querySelectorAll(selector);
          // Safe removal - check if the element exists and has a parent
          elements.forEach(el => {
            if (el && el.parentNode) {
              el.parentNode.removeChild(el);
            } else if (el) {
              // Check if element is HTMLElement before accessing style
              if (el instanceof HTMLElement) {
                el.style.display = 'none';
              }
            }
          });
        } catch (error) {
          console.log(`Erro ao remover ${selector}:`, error);
        }
      });

      // Remover qualquer iframe que possa estar carregando o botão
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        try {
          if (iframe.src && (iframe.src.includes('lovable') || iframe.src.includes('gptengineer'))) {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            } else {
              // Iframes are always HTMLElements, but we'll check to be safe
              if (iframe instanceof HTMLElement) {
                iframe.style.display = 'none';
              }
            }
          }
        } catch (error) {
          console.log('Erro ao remover iframe:', error);
        }
      });
    };

    // Remover imediatamente
    removeLovableElements();
    
    // Use a safer approach with fewer intervals
    const intervals = [100, 500, 1000, 2000];
    const timeouts = intervals.map(time => 
      setTimeout(removeLovableElements, time)
    );
    
    // Use a single interval that runs for a shorter period
    const intervalId = setInterval(removeLovableElements, 2000);
    const clearIntervalTimeout = setTimeout(() => clearInterval(intervalId), 10000);
    
    // Set up a safer MutationObserver
    let observer;
    try {
      observer = new MutationObserver((mutations) => {
        let shouldRemove = false;
        
        // Check if any new elements match our criteria
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                const el = node as HTMLElement;
                if (
                  (el.id && el.id.toLowerCase().includes('lovable')) || 
                  (el.className && typeof el.className === 'string' && el.className.toLowerCase().includes('lovable')) ||
                  (el.outerHTML && el.outerHTML.toLowerCase().includes('lovable'))
                ) {
                  shouldRemove = true;
                }
              }
            });
          }
        });
        
        // Only run the removal function if necessary
        if (shouldRemove) {
          removeLovableElements();
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false  // Reduce overhead by not watching attributes
      });
    } catch (error) {
      console.log('Erro ao configurar MutationObserver:', error);
    }
    
    // Clean up all resources on component unmount
    return () => {
      timeouts.forEach(timeoutId => clearTimeout(timeoutId));
      clearTimeout(clearIntervalTimeout);
      clearInterval(intervalId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return null;
};

export default RemoveLovableButton;
