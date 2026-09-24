import React from 'react';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TranslationProgressProps {
  progress: number;
  status: string;
  filename: string;
  message?: string;
}

export const TranslationProgress: React.FC<TranslationProgressProps> = ({
  progress,
  status,
  filename,
  message,
}) => {
  const isCompleted = status === 'completed' || progress === 100;
  const isFailed = status === 'failed';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : isFailed ? (
            <AlertTriangle className="w-6 h-6 text-red-500" />
          ) : (
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          )}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {isCompleted ? 'Traducción Finalizada' : isFailed ? 'Error en Traducción' : 'Traduciendo Libro...'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm">
              {filename}
            </p>
          </div>
        </div>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {progress}%
        </span>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isCompleted
              ? 'bg-emerald-500'
              : isFailed
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {message && (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
          {message}
        </p>
      )}
    </div>
  );
};
