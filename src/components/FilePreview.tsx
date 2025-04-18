
import React from 'react';
import { FileText, Image as ImageIcon, File, X } from 'lucide-react';
import { Button } from './ui/button';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  const isImage = file.type.startsWith('image/');
  
  const getFileIcon = () => {
    if (isImage) return <ImageIcon className="w-6 h-6" />;
    if (file.type.includes('pdf')) return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg mb-2">
      {isImage ? (
        <div className="relative w-20 h-20">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center w-20 h-20 bg-background/50 rounded">
          {getFileIcon()}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mt-1"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
