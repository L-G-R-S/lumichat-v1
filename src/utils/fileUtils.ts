
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
    
    reader.onerror = (error) => {
      console.error("Erro ao ler arquivo como texto:", error);
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
    
    reader.onerror = (error) => {
      console.error("Erro ao ler arquivo como DataURL:", error);
      reject(new Error(`Erro ao ler arquivo: ${file.name}`));
    };
    
    reader.readAsDataURL(file);
  });
};

// Processa um arquivo para ser enviado ao chat
export const processFileForChat = async (file: File, userMessage: string = ""): Promise<string> => {
  try {
    // Verifica se o arquivo é válido
    if (!file) {
      throw new Error("Arquivo inválido");
    }
    
    // Verifica o tamanho do arquivo
    if (!isFileSizeValid(file)) {
      throw new Error(`O arquivo excede o limite de tamanho (10MB)`);
    }
    
    // Determina o tipo de conteúdo
    let fileContent = "";
    
    if (file.type.startsWith('image/')) {
      // Processar imagem
      fileContent = await readFileAsDataURL(file);
      return `${userMessage}\n\n[Imagem enviada] ${fileContent}`;
    } else if (file.type === 'application/pdf') {
      // Processar PDF - apenas informações
      return `${userMessage}\n\n[PDF enviado] ${file.name} (${formatFileSize(file.size)})`;
    } else {
      // Tentar ler como texto para outros tipos de arquivo
      try {
        fileContent = await readFileAsText(file);
        return `${userMessage}\n\n[Arquivo enviado: ${file.name}]\n\nConteúdo:\n${fileContent}`;
      } catch (textError) {
        // Se falhar ao ler como texto, usar apenas as informações do arquivo
        console.warn("Não foi possível ler o conteúdo como texto:", textError);
        return `${userMessage}\n\n[Arquivo enviado] ${file.name} (${formatFileSize(file.size)})`;
      }
    }
  } catch (error) {
    console.error("Erro ao processar arquivo:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return `${userMessage}\n\n[Erro ao processar arquivo] ${errorMessage}`;
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

// Determina o tipo de arquivo baseado na extensão ou no mimetype
export const getFileType = (file: File): 'image' | 'document' | 'text' | 'pdf' | 'other' => {
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();
  
  if (mimeType.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName)) {
    return 'image';
  } else if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return 'pdf';
  } else if (
    mimeType.includes('text/') || 
    /\.(txt|md|log|csv|json|xml|html|css|js|ts)$/i.test(fileName)
  ) {
    return 'text';
  } else if (
    /\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(fileName) ||
    mimeType.includes('officedocument') ||
    mimeType.includes('msword')
  ) {
    return 'document';
  }
  
  return 'other';
};

// Valida o tipo de arquivo contra uma lista de tipos permitidos
export const isFileTypeAllowed = (
  file: File, 
  allowedTypes: string[] = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg']
): boolean => {
  if (allowedTypes.length === 0) return true;
  
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();
  
  return allowedTypes.some(type => {
    const typeWithoutDot = type.startsWith('.') ? type.substring(1) : type;
    return (
      // Verifica pela extensão
      fileName.endsWith(typeWithoutDot) || 
      // Verifica pelo mimetype
      mimeType.includes(typeWithoutDot) ||
      // Verifica mimetypes especiais
      (type === '.jpg' && mimeType === 'image/jpeg') ||
      (type === '.doc' && mimeType === 'application/msword') ||
      (type === '.docx' && mimeType.includes('officedocument.wordprocessingml'))
    );
  });
};
