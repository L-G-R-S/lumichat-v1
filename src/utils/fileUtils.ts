
/**
 * Utilitários para processamento de arquivos
 */

// Lê o conteúdo de um arquivo como texto
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error(`Erro ao ler arquivo: ${file.name}`));
    };
    
    reader.readAsText(file);
  });
};

// Lê o conteúdo de um arquivo como URL de dados
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error(`Erro ao ler arquivo: ${file.name}`));
    };
    
    reader.readAsDataURL(file);
  });
};

// Processa um arquivo para ser enviado ao chat
export const processFileForChat = async (file: File, userMessage: string = ""): Promise<string> => {
  try {
    let fileContent = "";
    
    if (file.type.startsWith('image/')) {
      fileContent = await readFileAsDataURL(file);
      return `${userMessage}\n\n[Imagem enviada] ${fileContent}`;
    } else {
      fileContent = await readFileAsText(file);
      return `${userMessage}\n\n[Arquivo enviado]\n\nConteúdo:\n${fileContent}`;
    }
  } catch (error) {
    console.error("Erro ao processar arquivo:", error);
    return `${userMessage}\n\n[Erro ao processar arquivo] Não foi possível ler o conteúdo de ${file.name}`;
  }
};

// Verifica se um arquivo está dentro do limite de tamanho
export const isFileSizeValid = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Formata o tamanho do arquivo para exibição
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};
