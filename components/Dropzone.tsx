import React, { useCallback, useState } from 'react';
import { Upload, FileImage, AlertCircle } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    // Simple size check (e.g., max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Max 10MB.');
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center gap-4 cursor-pointer group
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
            : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 bg-slate-900/50'
          }
        `}
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileInput}
        />
        
        <div className={`p-4 rounded-full bg-slate-800 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
          <Upload className={`w-10 h-10 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-200">
            Drop your image here
          </h3>
          <p className="text-slate-400 text-sm">
            or click to browse from your device
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
          <FileImage className="w-4 h-4" />
          <span>Supports PNG, JPG, WEBP up to 10MB</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
