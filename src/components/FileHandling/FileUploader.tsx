
import React, { useState, useCallback } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileText, File, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { isFileSizeValid, formatFileSize, isFileTypeAllowed, getFileType } from "@/utils/fileUtils";

interface FileUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  maxFileSizeMB?: number;
  allowedFileTypes?: string[];
}

const FileUploader: React.FC<FileUploaderProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  maxFileSizeMB = 10,
  allowedFileTypes = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg']
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const allowedTypesText = allowedFileTypes.join(', ');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    setErrorMessage(null);
    
    // Verificar tamanho do arquivo
    if (!isFileSizeValid(file, maxFileSizeMB)) {
      const errorMsg = `O arquivo excede o tamanho máximo de ${maxFileSizeMB}MB.`;
      setErrorMessage(errorMsg);
      toast.error("Arquivo muito grande", {
        description: errorMsg
      });
      return false;
    }
    
    // Verificar tipo de arquivo
    if (!isFileTypeAllowed(file, allowedFileTypes)) {
      const errorMsg = `Apenas arquivos ${allowedTypesText} são permitidos.`;
      setErrorMessage(errorMsg);
      toast.error("Tipo de arquivo não suportado", {
        description: errorMsg
      });
      return false;
    }
    
    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;
    
    setIsProcessing(true);
    setSelectedFile(file);
    setErrorMessage(null);
    
    try {
      // Simular progresso de upload
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      onFileSelect(file);
      setIsProcessing(false);
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erro desconhecido ao processar arquivo";
      setErrorMessage(errorMsg);
      toast.error("Erro ao processar arquivo", {
        description: errorMsg
      });
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMessage(null);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const getFileIcon = (file: File) => {
    const fileType = getFileType(file);
    
    switch (fileType) {
      case 'image':
        return <ImageIcon className="w-6 h-6" />;
      case 'pdf':
        return <FileText className="w-6 h-6" />;
      default:
        return <File className="w-6 h-6" />;
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsProcessing(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload de Arquivo</DialogTitle>
        </DialogHeader>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "mt-4 p-8 border-2 border-dashed rounded-lg transition-colors duration-200",
            isDragging ? "border-primary bg-primary/5" : "border-muted",
            isProcessing ? "pointer-events-none opacity-80" : "cursor-pointer"
          )}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                Arraste e solte seu arquivo aqui ou
              </p>
              <label className="mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90">
                Escolha um arquivo
                <input
                  type="file"
                  className="hidden"
                  accept={allowedFileTypes.join(',')}
                  onChange={handleFileSelect}
                  disabled={isProcessing}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              {allowedTypesText} (máx {maxFileSizeMB}MB)
            </p>
            
            {errorMessage && (
              <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
            )}
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              {getFileIcon(selectedFile)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCancel}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={uploadProgress} className="h-1" />
            <p className="text-xs text-muted-foreground mt-2">
              {isProcessing ? "Processando arquivo..." : "Pronto para processar"}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FileUploader;
