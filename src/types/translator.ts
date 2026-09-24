// Book Translator - TypeScript Types for RenewU Iberia (Phased Interactive Translation Pipeline)

export interface TranslationProvider {
  id: string;
  name: string;
  models: string[];
  configured: boolean;
}

export interface TranslationConfig {
  sourceLanguage: string;
  targetLanguage: string;
  model: string;
  provider: string;
  chunkSizeWords: number;
  temperature: number;
}

export interface BookSection {
  id?: string;
  title: string;
  sectionType: 'prologue' | 'toc' | 'chapter' | 'appendix';
  content: string;
  originalContent?: string;
  hasComplexIdiom?: boolean;
  difficultPhrase?: string;
}

export interface AIQuestion {
  id: string;
  chapterTitle: string;
  originalTerm: string;
  question: string;
  options?: string[];
  status: 'pending' | 'resolved';
  userResponse?: string;
}

export interface TranslationJob {
  id: number;
  filename: string;
  originalFilename: string;
  sourceLang: string;
  targetLang: string;
  translatorProvider: string;
  translatorModel: string | null;
  status: TranslationStatus;
  totalChapters: number;
  totalWords: number;
  translatedWords: number;
  totalTokensUsed: number;
  estimatedCostUsd: number;
  errorMessage: string | null;
  outputFilename: string | null;
  createdAt: string;
  completedAt: string | null;
  publishedToViewer?: boolean;
}

export type TranslationStatus =
  | 'pending'
  | 'parsing'
  | 'translating'
  | 'validating'
  | 'exporting'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface TranslationProgress {
  translationId: number;
  status: TranslationStatus;
  currentChapter: number;
  totalChapters: number;
  currentSection: number;
  totalSections: number;
  wordsTranslated: number;
  totalWords: number;
  percentage: number;
  etaSeconds: number | null;
  tokensUsed: number;
}

export interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
  status: 'ready' | 'uploading' | 'uploaded' | 'error';
  progress: number;
  error?: string;
}

export interface UploadResponse {
  message: string;
  filename: string;
  sizeBytes: number;
  sourceLang: string;
  targetLang: string;
  provider: string;
  status: string;
  note: string;
  translatedText?: string;
  translated_text?: string;
  chapters?: Array<{ title: string; content: string; sectionType?: 'prologue' | 'toc' | 'chapter' | 'appendix' }>;
  sections?: BookSection[];
  originalBook?: {
    title: string;
    language: string;
    sections: BookSection[];
  };
  aiQuestions?: AIQuestion[];
  downloadUrl?: string;
  download_url?: string;
  publishedBookId?: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  debug: boolean;
  database: string;
  availableTranslators: string[];
  availableParsers: string[];
}

export interface AppConfig {
  appName: string;
  version: string;
  supportedFormats: string[];
  availableTranslators: string[];
  defaultSourceLang: string;
  defaultTargetLang: string;
  chunkSizeWords: number;
  maxUploadSizeMb: number;
}

export interface Language {
  code: string;
  name: string;
  flag?: string;
  group?: 'Romance' | 'Germánica';
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  costTier: 'low' | 'medium' | 'high';
  speed: 'fast' | 'medium' | 'slow';
}

export const SUPPORTED_FORMATS = ['.pdf', '.epub', '.docx', '.txt'];

// Idiomas seleccionados: Lenguas Romances + Alemán + Inglés
export const LANGUAGES: Language[] = [
  { code: 'es-MX', name: 'Español (México)', flag: '🇲🇽', group: 'Romance' },
  { code: 'es-ES', name: 'Español (España)', flag: '🇪🇸', group: 'Romance' },
  { code: 'fr-FR', name: 'Français (Francés)', flag: '🇫🇷', group: 'Romance' },
  { code: 'it-IT', name: 'Italiano (Italiano)', flag: '🇮🇹', group: 'Romance' },
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷', group: 'Romance' },
  { code: 'pt-PT', name: 'Português (Portugal)', flag: '🇵🇹', group: 'Romance' },
  { code: 'ro-RO', name: 'Română (Rumano)', flag: '🇷🇴', group: 'Romance' },
  { code: 'de-DE', name: 'Deutsch (Alemán)', flag: '🇩🇪', group: 'Germánica' },
  { code: 'en-US', name: 'English (Estados Unidos)', flag: '🇺🇸', group: 'Germánica' },
];

export const AI_MODELS: ModelInfo[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', description: 'Máxima precisión teológica y literaria', costTier: 'high', speed: 'medium' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', description: 'Alta velocidad y eficiencia económica', costTier: 'low', speed: 'fast' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini', description: 'Contexto masivo y razonamiento analítico', costTier: 'medium', speed: 'fast' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', description: 'Excelente fluidez en lenguas romances', costTier: 'high', speed: 'medium' },
];
