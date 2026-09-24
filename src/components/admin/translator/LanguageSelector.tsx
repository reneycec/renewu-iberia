import React from 'react';
import { LANGUAGES } from '../../../types/translator';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

interface LanguageSelectorProps {
  sourceLang: string;
  targetLang: string;
  onSourceChange: (lang: string) => void;
  onTargetChange: (lang: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
}) => {
  return (
    <div className="bg-white border border-[#D6B858]/30 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <label className="text-xs font-black text-[#725c00] uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#D6B858]" />
          Selección de Idiomas (Lenguas Romances & Alemán)
        </label>
        <span className="text-[10px] font-extrabold bg-[#D6B858]/15 text-[#725c00] border border-[#D6B858]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D6B858]" /> Motores IA Calibrados
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center pt-1">
        {/* Idioma Origen */}
        <div className="md:col-span-5 space-y-1">
          <label className="text-xs font-bold text-gray-700 block">
            Idioma Origen del Documento
          </label>
          <select
            value={sourceLang}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858]"
          >
            {LANGUAGES.map((lang) => (
              <option key={`src-${lang.code}`} value={lang.code}>
                {lang.flag} {lang.name} ({lang.group})
              </option>
            ))}
          </select>
        </div>

        {/* Separador */}
        <div className="hidden md:flex md:col-span-1 justify-center pt-5">
          <div className="w-8 h-8 rounded-full bg-[#1A1A19] text-[#D6B858] flex items-center justify-center shadow-xs">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Idioma Destino */}
        <div className="md:col-span-5 space-y-1">
          <label className="text-xs font-bold text-gray-700 block">
            Idioma Destino (Traducción)
          </label>
          <select
            value={targetLang}
            onChange={(e) => onTargetChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858]"
          >
            {LANGUAGES.map((lang) => (
              <option key={`tgt-${lang.code}`} value={lang.code}>
                {lang.flag} {lang.name} ({lang.group})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
