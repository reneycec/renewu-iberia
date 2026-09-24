import React from 'react';
import { AI_MODELS, ModelInfo } from '../../../types/translator';
import { Cpu, Zap, DollarSign, CheckCircle2 } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (modelId: string, provider: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelSelect,
}) => {
  return (
    <div className="bg-white border border-[#D6B858]/30 rounded-2xl p-5 shadow-xs space-y-3">
      <label className="text-xs font-black text-[#725c00] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
        <Cpu className="w-4 h-4 text-[#D6B858]" />
        Selección del Motor de Inteligencia Artificial
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {AI_MODELS.map((model: ModelInfo) => {
          const isSelected = selectedModel === model.id;
          return (
            <div
              key={model.id}
              onClick={() => onModelSelect(model.id, model.provider)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 relative ${
                isSelected
                  ? 'border-[#D6B858] bg-[#D6B858]/10 shadow-xs ring-1 ring-[#D6B858]'
                  : 'border-gray-200 hover:border-[#D6B858]/60 bg-gray-50/60'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-[#D6B858]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              <div className="mb-1.5">
                <span className="font-extrabold text-sm text-[#1A1A19] block">
                  {model.name}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-500">
                  Proveedor: {model.provider}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                {model.description}
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-200/60 pt-2 font-medium">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#D6B858]" />
                  {model.speed === 'fast' ? 'Rápido' : 'Preciso'}
                </span>
                <span className="flex items-center gap-0.5">
                  <DollarSign className="w-3 h-3 text-emerald-600" />
                  {model.costTier === 'low' ? 'Económico' : 'Estándar'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
