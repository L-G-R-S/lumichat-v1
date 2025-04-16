
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Key } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeySubmit: (key: string) => void;
}

const ApiKeyInput = ({ apiKey, onApiKeySubmit }: ApiKeyInputProps) => {
  const [inputKey, setInputKey] = useState(apiKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApiKeySubmit(inputKey);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 bg-secondary/20 rounded-lg">
      <label htmlFor="apiKey" className="text-sm font-medium">
        API Key da Perplexity
      </label>
      <div className="flex gap-2">
        <Input
          id="apiKey"
          type="password"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="Insira sua API key aqui"
          className="flex-1"
        />
        <Button type="submit" size="sm">
          <Key className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Obtenha sua API key em:{' '}
        <a
          href="https://www.perplexity.ai/settings/api"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          perplexity.ai/settings/api
        </a>
      </p>
    </form>
  );
};

export default ApiKeyInput;
