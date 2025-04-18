
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, X, File, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFileProcess: (content: string) => void;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  isOpen,
  onClose,
  onFileProcess
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setCurrentFile(file);
    
    try {
      // Simular progresso de upload
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Processar arquivo baseado no tipo
      const content = await readFileContent(file);
      onFileProcess(content);
      onClose();
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
      setCurrentFile(null);
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = (error) => reject(error);
      
      if (file.type.includes('image')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
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
    if (file.type.includes('image')) return <ImageIcon className="w-6 h-6" />;
    if (file.type.includes('pdf')) return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            isProcessing ? "pointer-events-none opacity-50" : "cursor-pointer"
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
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                  disabled={isProcessing}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, DOCX, TXT, PNG, JPG (max 10MB)
            </p>
          </div>
        </div>

        {currentFile && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              {getFileIcon(currentFile)}
              <span className="text-sm font-medium truncate flex-1">
                {currentFile.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentFile(null)}
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

export default FileUploadDialog;
