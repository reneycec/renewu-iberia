import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { LanguageSelector } from './LanguageSelector';
import { ModelSelector } from './ModelSelector';
import { TranslationProgress } from './TranslationProgress';
import { TranslationResult } from './TranslationResult';
import { TranslationHistory } from './TranslationHistory';
import { uploadFile } from '../../../services/translationService';
import { UploadResponse } from '../../../types/translator';
import { ViewMode } from '../../../types';

import { ShieldCheck, Languages, Sparkles, AlertCircle } from 'lucide-react';

interface BookTranslatorAdminProps {
  isAdmin: boolean;
  onViewChange?: (view: any) => void;
}

export const BookTranslatorAdmin: React.FC<BookTranslatorAdminProps> = ({ isAdmin, onViewChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('es-MX');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [provider, setProvider] = useState('openai');

  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResponse | null>(null);

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-red-50 border border-red-200 rounded-2xl text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-red-800">
          Acceso Restringido - Exclusivo para Administrador
        </h3>
        <p className="text-xs text-red-600 max-w-md mx-auto">
          Esta función de traducción de libros con IA está reservada únicamente para administradores autorizados de RenewU Iberia.
        </p>
      </div>
    );
  }

  const handleModelSelect = (modelId: string, modelProvider: string) => {
    setSelectedModel(modelId);
    setProvider(modelProvider);
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setIsTranslating(true);
    setProgress(15);
    setResult(null);

    try {
      const response = await uploadFile(
        file,
        sourceLang,
        targetLang,
        provider,
        selectedModel,
        (pct) => setProgress(pct)
      );
      setResult(response);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleStartTranslation = async () => {
    if (!selectedFile) return;
    await processFile(selectedFile);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
  };

  const handleNavigateToViewer = () => {
    if (onViewChange) {
      onViewChange("book_reader");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner - RenewU Spirit */}
      <div className="bg-[#1A1A19] text-white rounded-2xl p-6 sm:p-8 shadow-xl border-b-4 border-[#D6B858] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-[#D6B858] text-[#1A1A19] font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Exclusivo Administrador
              </span>
              <span className="text-xs text-gray-400 font-semibold">RenewU AI Pipeline v3.0</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 text-white">
              <Languages className="w-7 h-7 text-[#D6B858]" />
              Traductor de Libros con IA (Lenguas Romances & Alemán)
            </h2>
            <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
              Soporte nativo para <strong>PDF, TXT, EPUB y DOCX</strong>: Estructura automáticamente por capítulos, traduce con precisión e integra directamente los libros en el visor interactivo de RenewU.
            </p>
          </div>
        </div>
      </div>

      {/* Main Workflow Grid */}
      {result ? (
        <TranslationResult
          result={result}
          onReset={handleReset}
          onNavigateToViewer={handleNavigateToViewer}
        />
      ) : isTranslating ? (
        <TranslationProgress
          progress={progress}
          status="translating"
          filename={selectedFile?.name || 'Libro'}
          message="Cargando y estructurando libro por capítulos..."
        />
      ) : (
        <div className="space-y-6">
          <FileUpload
            onFileSelect={(file) => processFile(file)}
            selectedFile={selectedFile}
            onClearFile={() => setSelectedFile(null)}
          />

          <LanguageSelector
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceChange={setSourceLang}
            onTargetChange={setTargetLang}
          />

          <ModelSelector
            selectedModel={selectedModel}
            onModelSelect={handleModelSelect}
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={handleStartTranslation}
              disabled={!selectedFile}
              className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all ${
                selectedFile
                  ? 'bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] cursor-pointer hover:shadow-lg active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Iniciar Extracción & Traducción con IA
            </button>
          </div>
        </div>
      )}

      {/* History section */}
      <TranslationHistory />
    </div>
  );
};
