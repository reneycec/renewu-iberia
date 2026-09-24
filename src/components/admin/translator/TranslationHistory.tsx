import React, { useEffect, useState } from 'react';
import { TranslationJob } from '../../../types/translator';
import { getJobsHistory } from '../../../services/translationService';
import { History, FileText, CheckCircle2, Clock } from 'lucide-react';

export const TranslationHistory: React.FC = () => {
  const [jobs, setJobs] = useState<TranslationJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobsHistory()
      .then((data) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
        Cargando historial de traducciones...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <History className="w-5 h-5 text-indigo-500" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Historial de Libros Traducidos por Administrador
        </h3>
      </div>

      {jobs.length === 0 ? (
        <p className="text-xs text-slate-400 py-4 text-center">
          No hay traducciones previas registradas.
        </p>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {jobs.map((job) => (
            <div key={job.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {job.originalFilename}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{job.sourceLang} ➔ {job.targetLang}</span>
                    <span>•</span>
                    <span className="uppercase">{job.translatorProvider}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[11px]">
                  <CheckCircle2 className="w-3 h-3" />
                  Completado
                </span>
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
