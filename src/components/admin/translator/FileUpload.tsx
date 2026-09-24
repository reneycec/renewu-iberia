import React, { useRef, useState } from 'react';
import { Upload, FileText, X, AlertCircle, FileCheck } from 'lucide-react';
import { SUPPORTED_FORMATS } from '../../../types/translator';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  onClearFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSetFile = (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_FORMATS.includes(ext)) {
      setError(`Formato no soportado (${ext}). Formatos permitidos: ${SUPPORTED_FORMATS.join(', ')}`);
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-[#D6B858] bg-[#D6B858]/10'
              : 'border-[#D6B858]/40 hover:border-[#D6B858] bg-white hover:bg-gray-50/50 shadow-xs'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
            accept=".pdf,.epub,.docx,.txt,text/plain,text/utf-8"
            className="hidden"
          />
          <div className="w-14 h-14 bg-[#1A1A19] text-[#D6B858] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-[#1A1A19] mb-1">
            Carga el Libro en PDF, TXT, EPUB o Documento
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto leading-relaxed">
            Procesador multiformato con soporte nativo para archivos <strong>.PDF, .TXT y .DOCX</strong> (originales o previamente traducidos). Estructura automáticamente por capítulos y sincroniza con el visor.
          </p>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#1A1A19] bg-[#D6B858] hover:bg-[#c3a447] rounded-lg transition-colors uppercase tracking-wider shadow-xs">
            <FileCheck className="w-4 h-4" /> Seleccionar Libro Local
          </span>
        </div>
      ) : (
        <div className="bg-white border-2 border-[#D6B858]/60 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-[#1A1A19] text-[#D6B858] rounded-xl flex items-center justify-center shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#1A1A19] truncate max-w-xs sm:max-w-md">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                Tamaño: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Procesamiento Extractor PDF Listo
              </p>
            </div>
          </div>
          <button
            onClick={onClearFile}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Quitar archivo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
