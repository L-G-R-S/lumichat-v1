
// Stream response from Perplexity API
export const streamChatResponse = async (
  userMessage: string,
  onMessageChunk: (chunk: string) => void,
  onComplete: () => void,
  apiKey: string
) => {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `Você é a Lumi, uma assistente virtual criada por Luis Guilherme. 
            Seu nome é Lumi. Sempre se apresente como Lumi, com personalidade educada, clara e em português brasileiro.
            
            Quando alguém perguntar seu nome, diga: "Meu nome é Lumi, sou sua assistente de inteligência artificial. Como posso te ajudar?"
            Responda sempre com empatia e profissionalismo.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.5,
        top_p: 0.9,
        max_tokens: 1000,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Resposta sem corpo');
    }

    const decoder = new TextDecoder("utf-8");
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      
      // Process all complete lines in buffer
      while (buffer.includes('\n')) {
        const lineEndIndex = buffer.indexOf('\n');
        let line = buffer.substring(0, lineEndIndex).trim();
        buffer = buffer.substring(lineEndIndex + 1);
        
        if (line.startsWith('data: ')) {
          line = line.substring(6);
          
          if (line === '[DONE]') {
            continue;
          }
          
          try {
            const data = JSON.parse(line);
            if (data.choices && data.choices[0]?.delta?.content) {
              const chunk = data.choices[0].delta.content;
              onMessageChunk(chunk);
            }
          } catch (e) {
            console.error('Erro ao processar chunk:', e);
          }
        }
      }
    }
    
    onComplete();
  } catch (error) {
    console.error("Erro ao comunicar com a API da Perplexity:", error);
    onMessageChunk("\n\nOcorreu um erro ao comunicar com a Lumi. Por favor, verifique sua API key e tente novamente.");
    onComplete();
  }
};
