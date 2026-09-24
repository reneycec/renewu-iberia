import React, { useState } from 'react';
import { UploadResponse, BookSection, AIQuestion } from '../../../types/translator';
import { publishToViewer, resolveQuestion, translateSections } from '../../../services/translationService';
import {
  BookOpen,
  CheckCircle2,
  Download,
  FileText,
  RefreshCw,
  Sparkles,
  Loader2,
  HelpCircle,
  MessageSquare,
  Globe,
  Layers,
  ArrowRight,
  Check,
  Send,
  UserCheck,
  Zap,
  Columns
} from 'lucide-react';

interface TranslationResultProps {
  result: UploadResponse;
  onReset: () => void;
  onNavigateToViewer: () => void;
}

export const TranslationResult: React.FC<TranslationResultProps> = ({
  result,
  onReset,
  onNavigateToViewer,
}) => {
  const [viewMode, setViewMode] = useState<'original' | 'translated'>('original');
  const [displayFormat, setDisplayFormat] = useState<'dual' | 'single'>('dual');
  const [isTranslatingLive, setIsTranslatingLive] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translatedSections, setTranslatedSections] = useState<BookSection[] | null>(null);
  const [translatingSectionIdx, setTranslatingSectionIdx] = useState<number | null>(null);
  const [questions, setQuestions] = useState<AIQuestion[]>(result.aiQuestions || []);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [humanConsultModal, setHumanConsultModal] = useState<string | null>(null);

  const targetLangLabel = result.targetLang || 'es-MX';

  React.useEffect(() => {
    if (result.translatedSections && result.translatedSections.length > 0) {
      setTranslatedSections(result.translatedSections);
      setViewMode('translated');
      setPublishedSuccess(true);
    } else {
      setViewMode('original');
      setTranslatedSections(null);
      setPublishedSuccess(false);
    }
    setDisplayFormat('dual');
    setQuestions(result.aiQuestions || []);
    setIsTranslatingLive(false);
    setTranslationProgress(0);
  }, [result]);

  const sections: BookSection[] = result.sections || [
    {
      title: "Prólogo: Introducción",
      sectionType: "prologue",
      content: `<p>Original document content loaded for ${result.filename}.</p>`,
    },
    {
      title: "Índice de Contenido",
      sectionType: "toc",
      content: `<p>Table of Contents</p>`,
    },
    {
      title: `Capítulo 1: ${result.filename.replace(/\.[^/.]+$/, "")}`,
      sectionType: "chapter",
      content: `<p>${result.translatedText || result.note}</p>`,
    }
  ];

  const activeSections = viewMode === 'translated' && translatedSections ? translatedSections : sections;

  // Resolve AI Question during live translation
  const handleResolveQuestion = async (qId: string, option: string) => {
    await resolveQuestion(qId, option);
    setQuestions(prev =>
      prev.map(q => q.id === qId ? { ...q, status: 'resolved', userResponse: option } : q)
    );
  };

  // Translate a single section on demand for side-by-side validation
  const handleTranslateSingleSection = async (secIdx: number) => {
    setTranslatingSectionIdx(secIdx);
    try {
      const resolvedInstructions = questions
        .filter(q => q.status === 'resolved' && q.userResponse)
        .map(q => ({ questionId: q.id, userResponse: q.userResponse! }));

      const targetSec = sections[secIdx];
      const res = await translateSections([targetSec], targetLangLabel, resolvedInstructions);

      if (res && res.translatedSections && res.translatedSections.length > 0) {
        const newlyTranslated = res.translatedSections[0];
        setTranslatedSections(prev => {
          const updated = prev ? [...prev] : [...sections];
          updated[secIdx] = newlyTranslated;
          return updated;
        });
      }
    } catch (err) {
      console.error("Error translating single section:", err);
    } finally {
      setTranslatingSectionIdx(null);
    }
  };

  // Instant batch translation: "Traducir todo ya sin revisión" + Auto-Pass to Viewer
  const handleTranslateAllDirectly = async () => {
    setIsTranslatingLive(true);
    setTranslationProgress(20);

    const resolvedInstructions = questions
      .filter(q => q.status === 'resolved' && q.userResponse)
      .map(q => ({ questionId: q.id, userResponse: q.userResponse! }));

    try {
      setTranslationProgress(60);
      const res = await translateSections(sections, targetLangLabel, resolvedInstructions);
      setTranslationProgress(95);

      if (res && res.translatedSections && res.translatedSections.length > 0) {
        setTranslatedSections(res.translatedSections);
        setViewMode('translated');

        // Auto-pass & auto-publish translated book to CMS Viewer Store immediately
        const cleanTitle = result.filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
        await publishToViewer({
          title: `${cleanTitle} (${targetLangLabel})`,
          author: "RenewU AI Translation Engine",
          year: "2026",
          chapters: res.translatedSections.map(s => ({
            title: `[${s.sectionType.toUpperCase()}] ${s.title}`,
            content: s.content
          })),
          category: "Biblioteca RenewU",
        });
        setPublishedSuccess(true);
      }
    } catch (err) {
      console.error("Error translating all sections:", err);
    } finally {
      setTranslationProgress(100);
      setTimeout(() => {
        setIsTranslatingLive(false);
        setViewMode('translated');
        setDisplayFormat('dual');
      }, 400);
    }
  };

  // Start live step-by-step translation process
  const handleStartLiveTranslation = async () => {
    await handleTranslateAllDirectly();
  };

  const handlePublishAndRead = async () => {
    setIsPublishing(true);
    try {
      const cleanTitle = result.filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      const res = await publishToViewer({
        title: `${cleanTitle} (${viewMode === 'original' ? result.sourceLang : targetLangLabel})`,
        author: "RenewU AI Translation Engine",
        year: "2026",
        chapters: activeSections.map(s => ({
          title: `[${s.sectionType.toUpperCase()}] ${s.title}`,
          content: s.content
        })),
        category: "Biblioteca RenewU",
      });

      if (res.success) {
        setPublishedSuccess(true);
        setTimeout(() => {
          onNavigateToViewer();
        }, 1200);
      }
    } catch (err) {
      console.error("Error publishing book:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownloadTxt = () => {
    const text = activeSections.map(s => `--- ${s.title} ---\n${s.content.replace(/<[^>]+>/g, '')}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${viewMode.toUpperCase()}_${result.filename}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getBadgeStyle = (sType: string) => {
    switch (sType) {
      case 'prologue':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'toc':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'appendix':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-[#D6B858]/20 text-[#725c00] border-[#D6B858]/40';
    }
  };

  return (
    <div className="bg-white border-2 border-[#D6B858]/60 rounded-2xl p-6 shadow-md space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#1A1A19] text-[#D6B858] rounded-full flex items-center justify-center shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#1A1A19]">
              {viewMode === 'original' ? 'Libro Original Cargado' : 'Libro Traducido'}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Documento: <strong>{result.filename}</strong> (Idioma Origen: {result.sourceLang})
            </p>
          </div>
        </div>

        {/* Controls: Mode Switcher & Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200">
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === 'original'
                  ? 'bg-[#1A1A19] text-[#D6B858] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📖 Libro Original ({result.sourceLang})
            </button>
            <button
              onClick={() => {
                if (!translatedSections && !isTranslatingLive) {
                  handleStartLiveTranslation();
                } else {
                  setViewMode('translated');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === 'translated'
                  ? 'bg-[#D6B858] text-[#1A1A19] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🌐 Versión Traducida ({targetLangLabel})
            </button>
          </div>

          <button
            onClick={onReset}
            className="p-2 text-gray-400 hover:text-[#1A1A19] bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            title="Cargar otro libro"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar (Fase 3: Live Translation Progress) */}
      {isTranslatingLive && (
        <div className="bg-gray-50 border border-[#D6B858]/40 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-extrabold text-[#725c00]">
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-4 h-4 text-[#D6B858] animate-spin" />
              Traduciendo Capítulos e Identificando Modismos...
            </span>
            <span>{translationProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#D6B858] h-full transition-all duration-300"
              style={{ width: `${translationProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* AI Interactive Doubts / Questions Panel ("La IA Pregunta") */}
      {questions.length > 0 && (
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              La IA tiene dudas sobre expresiones de difícil traducción ({questions.filter(q => q.status === 'pending').length} pendientes)
            </h4>
            <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
              Interacción en Vivo
            </span>
          </div>

          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="bg-white border border-amber-200 rounded-xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">{q.chapterTitle}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    Término: "{q.originalTerm}"
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-900">{q.question}</p>

                {q.status === 'resolved' ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Instrucción Aplicada: "{q.userResponse}"
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {q.options?.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleResolveQuestion(q.id, opt)}
                        className="text-xs bg-amber-100 hover:bg-[#D6B858] text-amber-900 hover:text-[#1A1A19] font-bold px-3 py-1.5 rounded-lg border border-amber-200 transition-all text-left cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Structural Explorer & Reader (Dual Column / Side by Side) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="space-y-0.5">
            <span className="flex items-center gap-2 text-xs font-extrabold text-[#1A1A19]">
              <Layers className="w-4 h-4 text-[#D6B858]" />
              Estructura del Documento ({sections.length} Secciones Identificadas)
            </span>
            <p className="text-[11px] text-gray-500 font-medium">
              Compara el texto original en la columna izquierda y la traducción en tiempo real en la derecha.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTranslateAllDirectly}
              disabled={isTranslatingLive}
              className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 text-[#1A1A19]" />
              ⚡ Traducir Todo Ya (Sin Revisión)
            </button>

            <button
              onClick={() => setDisplayFormat(prev => prev === 'dual' ? 'single' : 'dual')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Columns className="w-3.5 h-3.5" />
              {displayFormat === 'dual' ? 'Vista Columna Única' : 'Vista Dual Paralela'}
            </button>
          </div>
        </div>

        {/* Section List: Side-by-Side Dual View */}
        <div className="space-y-6 max-h-[650px] overflow-y-auto pr-2 border border-gray-200 rounded-xl p-4 bg-gray-100/50">
          {sections.map((sec, idx) => {
            const translatedSec = translatedSections ? translatedSections[idx] : null;
            const isTranslated = !!translatedSec;
            const isTranslatingThis = translatingSectionIdx === idx;

            return (
              <div key={idx} className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-[#1A1A19] bg-gray-100 px-2.5 py-1 rounded-lg">
                      Sección {idx + 1}
                    </span>
                    <h4 className="font-extrabold text-sm text-[#1A1A19]">
                      {sec.title}
                    </h4>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${getBadgeStyle(sec.sectionType)}`}>
                      {sec.sectionType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isTranslated ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Traducido
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        Pendiente
                      </span>
                    )}

                    <button
                      onClick={() => handleTranslateSingleSection(idx)}
                      disabled={isTranslatingThis || isTranslatingLive}
                      className="bg-amber-100 hover:bg-[#D6B858] text-amber-900 hover:text-[#1A1A19] font-extrabold text-xs px-3 py-1 rounded-lg border border-amber-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isTranslatingThis ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-800" />
                          Traduciendo...
                        </>
                      ) : (
                        <>
                          <Globe className="w-3.5 h-3.5" />
                          {isTranslated ? 'Volver a Traducir' : 'Traducir Esta Sección'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Dual Column View: Original vs Traducido */}
                {displayFormat === 'dual' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Original Language */}
                    <div className="bg-gray-50/90 border border-gray-200 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center gap-1">
                          📖 Original ({result.sourceLang})
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">Texto Extraído del PDF</span>
                      </div>
                      <div
                        className="text-xs text-gray-800 leading-relaxed font-serif max-h-[350px] overflow-y-auto pr-1 space-y-2"
                        dangerouslySetInnerHTML={{ __html: sec.content }}
                      />
                    </div>

                    {/* Right: Translated Target Language */}
                    <div className="bg-amber-50/40 border border-amber-200/70 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center border-b border-amber-200 pb-1.5">
                        <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                          🌐 Traducción ({targetLangLabel})
                        </span>
                        <span className="text-[10px] font-bold text-amber-700">Versión Traducida</span>
                      </div>

                      {isTranslated && translatedSec ? (
                        <div className="space-y-2">
                          <h5 className="font-extrabold text-xs text-[#1A1A19] border-b border-amber-100 pb-1">
                            {translatedSec.title}
                          </h5>
                          <div
                            className="text-xs text-gray-900 leading-relaxed font-serif max-h-[350px] overflow-y-auto pr-1 space-y-2"
                            dangerouslySetInnerHTML={{ __html: translatedSec.content }}
                          />
                        </div>
                      ) : (
                        <div className="py-8 text-center space-y-3">
                          <p className="text-xs text-amber-800 font-medium max-w-xs mx-auto">
                            Esta sección aún no ha sido traducida al español.
                          </p>
                          <button
                            onClick={() => handleTranslateSingleSection(idx)}
                            disabled={isTranslatingThis || isTranslatingLive}
                            className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            Traducir Sección {idx + 1}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Single Column View */
                  <div className="text-xs text-gray-800 leading-relaxed space-y-2 font-serif"
                    dangerouslySetInnerHTML={{ __html: isTranslated && translatedSec ? translatedSec.content : sec.content }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-2">
        <button
          onClick={handleDownloadTxt}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Descargar Texto (.TXT)
        </button>

        <button
          onClick={handlePublishAndRead}
          disabled={isPublishing || publishedSuccess}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer ${
            publishedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] active:scale-95'
          }`}
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Publicando en la Biblioteca...
            </>
          ) : publishedSuccess ? (
            <>
              <Sparkles className="w-4 h-4" />
              ¡Publicado! Abriendo Visor...
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" />
              Publicar y Leer en el Visor de Libros
            </>
          )}
        </button>
      </div>
    </div>
  );
};
