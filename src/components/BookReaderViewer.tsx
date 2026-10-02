import React, { useEffect, useState, useMemo } from "react";
import { StudentEnrollment, BookItem, ViewMode, StudentReadingProgress } from "../types";
import { Dictionary } from "../data/translations";
import { SecurityGuard } from "../services/SecurityGuard";
import { BookReaderEngine, ReaderState } from "../services/BookReaderEngine";
import { BookCatalogService } from "../services/BookCatalogService";
import { StudentReadingTracker } from "../services/StudentReadingTracker";
import {
  BookOpen,
  Lock,
  ChevronLeft,
  ChevronRight,
  List,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Search,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Clock,
  UserCheck,
  FileText,
  AlertTriangle,
  ArrowRight,
  User,
  Calendar,
  Layers,
  Bookmark,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface BookReaderViewerProps {
  currentStudent: StudentEnrollment | null;
  onViewChange: (view: ViewMode) => void;
  t: Dictionary;
  isAdmin?: boolean;
}

/**
 * Clean & Normalize Spanish Text (Fixes PDF font em-dash artifacts & strips raw <p> tags)
 */
function cleanAndNormalizeSpanishText(rawText: string): string[] {
  if (!rawText) return [];

  let text = rawText;

  // Strip out raw printed TOC blocks (CONTENIDO Capítulo 1 ... 8 Capítulo 2 ... 16)
  text = text.replace(/\s*(?:CONTENIDO|ÍNDICE|TABLA DE CONTENIDOS)\s+Cap[íi]tulo\s+1\b.*?(?:Notas al pie\s+\d+|Ap[ée]ndice.*?\d+|\d+\s*$)/gi, "");
  text = text.replace(/\s*(?:CONTENIDO|ÍNDICE|TABLA DE CONTENIDOS)\s+(?:Cap[íi]tulo|\d+).*?\d{1,4}\b/gi, "");

  // Remove raw <p> and </p> tags
  text = text.replace(/<p>/gi, "").replace(/<\/p>/gi, "\n\n");
  text = text.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  // Fix PDF font byte mismappings (em-dash / U+FFFD artifacts in Spanish words)
  text = text
    .replace(/PREGUNTAS DE REFLEXI\s*[\ufffd\?\uFFFD—]\s*N/gi, "PREGUNTAS DE REFLEXIÓN")
    .replace(/DISCUSI\s*[\ufffd\?\uFFFD—]\s*N/gi, "DISCUSIÓN")
    .replace(/REFLEXI\s*[\ufffd\?\uFFFD—]\s*N/gi, "REFLEXIÓN")
    .replace(/salvaci\s*[\ufffd\?\uFFFD—]\s*n/gi, "salvación")
    .replace(/Salvaci\s*[\ufffd\?\uFFFD—]\s*n/gi, "Salvación")
    .replace(/Qu\s*[\ufffd\?\uFFFD—]\s*te/gi, "Qué te")
    .replace(/Qu\s*[\ufffd\?\uFFFD—]\s*/gi, "Qué ")
    .replace(/qu\s*[\ufffd\?\uFFFD—]\s*/gi, "qué ")
    .replace(/cu\s*[\ufffd\?\uFFFD—]\s*l/gi, "cuál")
    .replace(/cu\s*[\ufffd\?\uFFFD—]\s*les/gi, "cuáles")
    .replace(/c\s*[\ufffd\?\uFFFD—]\s*mo/gi, "cómo")
    .replace(/d\s*[\ufffd\?\uFFFD—]\s*nde/gi, "dónde")
    .replace(/est\s*[\ufffd\?\uFFFD—]\s*n/gi, "están")
    .replace(/est\s*[\ufffd\?\uFFFD—]\s*í/gi, "está?")
    .replace(/tambi\s*[\ufffd\?\uFFFD—]\s*n/gi, "también")
    .replace(/cl\s*[\ufffd\?\uFFFD—]\s*sico/gi, "clásico")
    .replace(/deber\s*[\ufffd\?\uFFFD—]\s*an/gi, "deberían")
    .replace(/ense\s*[\ufffd\?\uFFFD—]\s*a/gi, "enseña")
    .replace(/ense\s*[\ufffd\?\uFFFD—]\s*anza/gi, "enseñanza")
    .replace(/ense\s*[\ufffd\?\uFFFD—]\s*anzas/gi, "enseñanzas")
    .replace(/Esp\s*[\ufffd\?\uFFFD—]\s*ritu/gi, "Espíritu")
    .replace(/teolog\s*[\ufffd\?\uFFFD—]\s*a/gi, "teología")
    .replace(/evang\s*[\ufffd\?\uFFFD—]\s*lica/gi, "evangélica")
    .replace(/evang\s*[\ufffd\?\uFFFD—]\s*licos/gi, "evangélicos")
    .replace(/Jes\s*[\ufffd\?\uFFFD—]\s*s/gi, "Jesús")
    .replace(/—\s*í/g, "?")
    .replace(/—\s*\?/g, "?")
    .replace(/\s+—\s+/g, " — ");

  // Split into clean paragraphs
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return paragraphs.length > 0 ? paragraphs : [text];
}

export const BookReaderViewer: React.FC<BookReaderViewerProps> = ({
  currentStudent,
  onViewChange,
  t,
  isAdmin = false,
}) => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [readerState, setReaderState] = useState<ReaderState | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [verificationEmail, setVerificationEmail] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedStudentData, setVerifiedStudentData] = useState<any | null>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("renewu_reader_student_profile");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("renewu_reader_student_verified") === "true";
    }
    return false;
  });
  const [verificationError, setVerificationError] = useState<string>("");
  const [isDevToolsDetected, setIsDevToolsDetected] = useState<boolean>(false);
  
  // Student reading tracker state
  const [studentProgress, setStudentProgress] = useState<StudentReadingProgress | null>(null);
  const [bookmarkSavedToast, setBookmarkSavedToast] = useState<string | null>(null);

  // Initialize OOP Engine, Security Guard, & Tracker instances
  const engine = useMemo(() => new BookReaderEngine(), []);
  const securityGuard = useMemo(() => SecurityGuard.getInstance(), []);
  const tracker = useMemo(() => StudentReadingTracker.getInstance(), []);

  const studentId = currentStudent?.id || verifiedStudentData?.id || (isAdmin ? "admin-moodle" : "student-guest-001");
  const isUserAuthenticated = isAdmin || !!currentStudent || verificationSuccess;

  // Fetch Catalog Books
  useEffect(() => {
    const catalogService = BookCatalogService.getInstance();
    catalogService.fetchBooks().then((fetchedBooks) => {
      setBooks(fetchedBooks);
      if (fetchedBooks.length > 0) {
        setSelectedBookId(fetchedBooks[0].id);
        engine.loadBook(fetchedBooks[0]);
      }
    });
  }, [engine]);

  // Subscribe to Engine state changes
  useEffect(() => {
    const unsubscribe = engine.subscribe((state) => {
      setReaderState(state);
    });
    return () => unsubscribe();
  }, [engine]);

  // Subscribe to DevTools detection from SecurityGuard
  useEffect(() => {
    const unsubscribeDevTools = securityGuard.onDevToolsChange((isOpen) => {
      setIsDevToolsDetected(isOpen);
    });
    return () => unsubscribeDevTools();
  }, [securityGuard]);

  // Restore student reading progress when book changes
  useEffect(() => {
    let isMounted = true;
    if (isUserAuthenticated && selectedBookId) {
      tracker.getProgress(studentId, selectedBookId).then((prog) => {
        if (isMounted && prog) {
          setStudentProgress(prog);
          if (prog.lastChapterIndex >= 0 && readerState?.currentChapterIndex !== prog.lastChapterIndex) {
            engine.jumpToChapter(prog.lastChapterIndex);
          }
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isUserAuthenticated, selectedBookId, studentId]);

  // Save progress when user explicitly changes chapter
  useEffect(() => {
    if (isUserAuthenticated && selectedBookId && readerState && readerState.currentChapterIndex !== undefined) {
      const currentProgressPct = engine.calculateProgress();
      const newProg: StudentReadingProgress = {
        studentId,
        bookId: selectedBookId,
        lastChapterIndex: readerState.currentChapterIndex,
        progressPercentage: currentProgressPct,
        totalTimeMinutes: (studentProgress?.totalTimeMinutes || 0) + 1,
        bookmarks: studentProgress?.bookmarks || [],
        lastReadAt: new Date().toISOString(),
      };

      const timer = setTimeout(() => {
        tracker.saveProgress(newProg);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [readerState?.currentChapterIndex, selectedBookId, isUserAuthenticated]);

  // Activate / Deactivate Security Guard when viewing reader
  useEffect(() => {
    if (isUserAuthenticated) {
      let studentName = "Estudiante-RenewU";
      if (isAdmin) {
        studentName = "ADMINISTRADOR (Acceso Total Moodle)";
      } else if (currentStudent) {
        studentName = `${currentStudent.firstName} ${currentStudent.lastName}`;
      } else if (verifiedStudentData?.name) {
        studentName = `${verifiedStudentData.name}`;
      }
      const watermarkInfo = `CONFIDENCIAL — ${studentName} — NO COPIAR`;

      securityGuard.enableProtection({
        preventRightClick: true,
        preventCopy: true,
        preventPrint: true,
        preventShortcuts: true,
        watermarkText: watermarkInfo,
      });
    } else {
      securityGuard.disableProtection();
    }

    return () => {
      securityGuard.disableProtection();
    };
  }, [isUserAuthenticated, currentStudent, verifiedStudentData, isAdmin, securityGuard]);

  // Handle Book Selection Change
  const handleSelectBook = (bookId: string) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (targetBook) {
      setSelectedBookId(bookId);
      engine.loadBook(targetBook);
    }
  };

  // Save Bookmark Handler
  const handleAddBookmark = async () => {
    if (!selectedBookId || !readerState) return;
    const currentChap = engine.getCurrentChapter();
    if (!currentChap) return;

    const updatedProg = await tracker.addBookmark(
      studentId,
      selectedBookId,
      readerState.currentChapterIndex,
      currentChap.title,
      `Marcador en ${currentChap.title}`
    );

    setStudentProgress(updatedProg);
    setBookmarkSavedToast(`📌 Marcador guardado en ${currentChap.title}`);
    setTimeout(() => setBookmarkSavedToast(null), 3000);
  };

  // Real Moodle API student verification
  const handleVerifyStudentEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = verificationEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setVerificationError("Por favor ingresa tu correo de registro o el asociado a Moodle.");
      return;
    }
    
    setIsVerifying(true);
    setVerificationError("");

    try {
      const res = await fetch(`/api/moodle/verify-user?email=${encodeURIComponent(cleanEmail)}`);
      const data = await res.json();

      if (data.success && data.verified) {
        sessionStorage.setItem("renewu_reader_student_verified", "true");
        if (data.student) {
          sessionStorage.setItem("renewu_reader_student_profile", JSON.stringify(data.student));
          setVerifiedStudentData(data.student);
        }
        setVerificationSuccess(true);
        setVerificationError("");
      } else {
        setVerificationError(
          data.message || "No encontramos matrícula activa en Moodle ni en el registro académico para este correo."
        );
      }
    } catch (err: any) {
      setVerificationError(`Error al verificar matrícula: ${err.message || "Fallo de conexión"}`);
    } finally {
      setIsVerifying(false);
    }
  };

  // Toggle Fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Render Restricted Access Barrier for Unregistered Users
  if (!isUserAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl border-2 border-[#D6B858] p-8 md:p-12 shadow-2xl space-y-6 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-[#1A1A19] text-[#D6B858] flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="bg-[#D6B858]/20 text-[#725c00] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-[#D6B858]/40">
              Acceso Exclusivo a Biblioteca RenewU
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#1A1A19]">
              Visor de Lectura Restringido a Estudiantes Registrados
            </h2>
            <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">
              Los libros y compendios del curso están protegidos por derechos de autor. Para acceder al visor de lectura interactivo debes estar matriculado o registrado en el sistema de Renew University.
            </p>
          </div>

          {/* Quick Email Check Form */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md mx-auto space-y-4 text-left">
            <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#D6B858]" />
              <span>¿Ya completaste tu registro de matrícula?</span>
            </h4>
            <p className="text-xs text-gray-500">
              Ingresa el correo electrónico con el que llenaste tu formulario para habilitar tu visor de lectura inmediatamente:
            </p>

            <form onSubmit={handleVerifyStudentEmail} className="space-y-3">
              <input
                type="email"
                placeholder="ejemplo@estudiante.com"
                value={verificationEmail}
                disabled={isVerifying}
                onChange={(e) => setVerificationEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none disabled:bg-gray-100"
              />
              {verificationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg font-medium leading-relaxed">
                  ⚠️ {verificationError}
                </div>
              )}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-[#1A1A19] hover:bg-gray-800 disabled:opacity-60 text-[#D6B858] font-bold text-xs py-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#D6B858] border-t-transparent rounded-full animate-spin" />
                    <span>Verificando matrícula en Moodle...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-[#D6B858]" />
                    <span>Verificar Acceso de Estudiante en Moodle</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-center items-center gap-4 text-xs">
            <span className="text-gray-500">¿Aún no te has registrado en el programa?</span>
            <button
              onClick={() => onViewChange("enrollment")}
              className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-extrabold px-5 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <FileText className="w-4 h-4" />
              <span>Registrarse y Matricularse Ahora</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Reader Variables
  const currentChapter = engine.getCurrentChapter();
  const theme = readerState?.theme || "sepia";
  const zoom = readerState?.zoomLevel || 100;
  const isSidebarOpen = readerState?.isSidebarOpen ?? true;
  const activeBook = readerState?.book;

  // Clean & Normalize current chapter text into paragraphs
  const chapterParagraphs = useMemo(() => {
    return cleanAndNormalizeSpanishText(currentChapter?.content || "");
  }, [currentChapter]);

  // Page pagination breakdown (3 paragraphs per page)
  const PARAGRAPHS_PER_PAGE = 3;
  const totalPagesInChapter = Math.max(1, Math.ceil(chapterParagraphs.length / PARAGRAPHS_PER_PAGE));
  const currentPageParagraphs = useMemo(() => {
    const start = currentPageIndex * PARAGRAPHS_PER_PAGE;
    return chapterParagraphs.slice(start, start + PARAGRAPHS_PER_PAGE);
  }, [chapterParagraphs, currentPageIndex]);

  // Reset page index when chapter changes
  useEffect(() => {
    setCurrentPageIndex(0);
  }, [readerState?.currentChapterIndex, selectedBookId]);

  // Page Navigation Handlers
  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    } else if ((readerState?.currentChapterIndex || 0) > 0) {
      engine.prevChapter();
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPagesInChapter - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    } else if ((readerState?.currentChapterIndex || 0) < (activeBook?.chapters.length || 1) - 1) {
      engine.nextChapter();
      setCurrentPageIndex(0);
    }
  };

  // Keyboard Navigation (Left & Right Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        handlePrevPage();
      } else if (e.key === "ArrowRight") {
        handleNextPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPageIndex, totalPagesInChapter, readerState?.currentChapterIndex, activeBook]);

  // Theme styling definitions
  const themeStyles = {
    light: "bg-white text-gray-900 border-gray-200",
    sepia: "bg-[#FBF0D9] text-[#2B261F] border-[#E8DAB9]",
    dark: "bg-[#181817] text-[#E0E0DC] border-gray-800",
  };

  let studentDisplayName = "Estudiante-Moodle";
  if (isAdmin) {
    studentDisplayName = "ADMINISTRADOR (Acceso Moodle)";
  } else if (currentStudent) {
    studentDisplayName = `${currentStudent.firstName} ${currentStudent.lastName}`;
  } else if (verifiedStudentData?.name) {
    studentDisplayName = `${verifiedStudentData.name}`;
  }

  const watermarkSVG = securityGuard.generateWatermarkSVG(
    `CONFIDENCIAL — ${studentDisplayName} — NO COPIAR`
  );

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${themeStyles[theme]}`}>
      {/* Bookmark Toast */}
      {bookmarkSavedToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#1A1A19] text-[#D6B858] border border-[#D6B858] px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Bookmark className="w-4 h-4 text-[#D6B858]" />
          <span>{bookmarkSavedToast}</span>
        </div>
      )}

      {/* DevTools Warning Banner Overlay */}
      {isDevToolsDetected && (
        <div className="fixed top-16 inset-x-0 z-50 bg-red-600 text-white font-extrabold text-xs py-3 px-4 text-center flex items-center justify-center gap-2 shadow-2xl animate-pulse">
          <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
          <span>⚠️ Se detectaron herramientas de desarrollo. La lectura ha sido pausada por seguridad.</span>
        </div>
      )}

      {/* Security Banner Header with Reading Tracker Badge */}
      <div className="bg-[#1A1A19] text-[#D6B858] px-4 py-1.5 text-xs flex items-center justify-between border-b border-[#D6B858]/40 shadow-xs">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Visor Protegido RenewU (Anti-Descarga & DRM Activo)</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-400">
          {isAdmin ? (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              🔓 Acceso Total Administrador Moodle
            </span>
          ) : (
            <span>Estudiante: <strong className="text-white">{studentDisplayName}</strong></span>
          )}
          <span>•</span>
          <span className="text-[#D6B858] font-bold">
            📌 Tu Avance: {studentProgress?.progressPercentage || engine.calculateProgress()}%
          </span>
        </div>
      </div>

      {/* Primary Reader Top Bar with Metadata Badges */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Left: Sidebar Toggle & Book Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => engine.toggleSidebar()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1.5 text-xs font-bold border border-gray-200 dark:border-gray-700 cursor-pointer"
            title="Alternar Índice de Navegación"
          >
            <List className="w-4 h-4 text-[#D6B858]" />
            <span>{isSidebarOpen ? "◀ ÍNDICE" : "▶ ÍNDICE"}</span>
          </button>

          {/* Book Catalog Dropdown */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#D6B858] shrink-0" />
            <select
              value={selectedBookId}
              onChange={(e) => handleSelectBook(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white rounded-lg px-3 py-1.5 outline-none max-w-[200px] sm:max-w-[280px] truncate cursor-pointer"
            >
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} — {book.author}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Metadata Badges Bar */}
        {activeBook && (
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-amber-300/60">
              <User className="w-3.5 h-3.5 text-[#D6B858]" />
              <span>{activeBook.author}</span>
            </span>

            {activeBook.year && (
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-gray-300/60">
                <Calendar className="w-3.5 h-3.5 text-[#D6B858]" />
                <span>{activeBook.year}</span>
              </span>
            )}

            <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-emerald-300/60">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>{activeBook.chapters.length} capítulos</span>
            </span>
          </div>
        )}

        {/* Right: Controls (Bookmark, Zoom, Theme, Fullscreen) */}
        <div className="flex items-center gap-2">
          {/* Add Bookmark Button */}
          <button
            onClick={handleAddBookmark}
            className="flex items-center gap-1 bg-[#D6B858]/20 hover:bg-[#D6B858]/30 text-[#725c00] dark:text-[#D6B858] font-bold text-xs px-3 py-1.5 rounded-lg border border-[#D6B858]/40 transition-colors cursor-pointer"
            title="Guardar Marcador en este Capítulo"
          >
            <Bookmark className="w-3.5 h-3.5 fill-[#D6B858]" />
            <span className="hidden sm:inline">Guardar Marcador</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700 text-xs">
            <button
              onClick={() => engine.setZoom(zoom - 10)}
              className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 cursor-pointer"
              title="Disminuir Tamaño"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono font-bold text-[11px] text-gray-600 dark:text-gray-400">
              {zoom}%
            </span>
            <button
              onClick={() => engine.setZoom(zoom + 10)}
              className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 cursor-pointer"
              title="Aumentar Tamaño"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700 text-xs">
            <button
              onClick={() => engine.setTheme("light")}
              className={`p-1.5 rounded cursor-pointer ${theme === "light" ? "bg-white text-[#1A1A19] shadow-xs" : "text-gray-500"}`}
              title="Modo Luz"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => engine.setTheme("sepia")}
              className={`p-1.5 rounded cursor-pointer ${theme === "sepia" ? "bg-[#E8DAB9] text-[#2B261F] shadow-xs font-bold" : "text-gray-500"}`}
              title="Modo Sepia"
            >
              <span className="text-[11px]">Sepia</span>
            </button>
            <button
              onClick={() => engine.setTheme("dark")}
              className={`p-1.5 rounded cursor-pointer ${theme === "dark" ? "bg-gray-900 text-white shadow-xs" : "text-gray-500"}`}
              title="Modo Oscuro"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 cursor-pointer"
            title="Pantalla Completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-800 h-1">
        <div
          className="bg-[#D6B858] h-1 transition-all duration-300"
          style={{ width: `${engine.calculateProgress()}%` }}
        />
      </div>

      {/* Reading Controls Toolbar (Página Anterior / Página Siguiente) */}
      <div className="bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 px-6 py-2 flex items-center justify-between text-xs font-bold shadow-xs">
        <button
          onClick={handlePrevPage}
          disabled={readerState?.currentChapterIndex === 0 && currentPageIndex === 0}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
            readerState?.currentChapterIndex === 0 && currentPageIndex === 0
              ? "opacity-30 cursor-not-allowed border-gray-300"
              : "bg-gray-100 hover:bg-[#D6B858]/20 border-gray-300 text-gray-800"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>◀ Página Anterior</span>
        </button>

        <div className="text-center">
          <span className="text-gray-800 dark:text-gray-200 font-mono text-xs font-bold block">
            Página {currentPageIndex + 1} de {totalPagesInChapter}
          </span>
          <span className="text-[10px] text-gray-400 font-mono block">
            Capítulo {(readerState?.currentChapterIndex || 0) + 1} de {activeBook?.chapters.length || 1}
          </span>
        </div>

        <button
          onClick={handleNextPage}
          disabled={
            readerState?.currentChapterIndex === (activeBook?.chapters.length || 1) - 1 &&
            currentPageIndex === totalPagesInChapter - 1
          }
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs ${
            readerState?.currentChapterIndex === (activeBook?.chapters.length || 1) - 1 &&
            currentPageIndex === totalPagesInChapter - 1
              ? "opacity-30 cursor-not-allowed bg-gray-300 text-gray-600"
              : "bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black"
          }`}
        >
          <span>Página Siguiente ▶</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Body Area (Sidebar Drawer + Content Canvas) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Sidebar (Índice de Navegación) */}
        {isSidebarOpen && (
          <aside className="w-80 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xs flex flex-col h-[calc(100vh-160px)] overflow-y-auto p-4 space-y-4 shadow-sm z-20">
            {/* Sidebar Header */}
            <div className="flex justify-between items-start pb-3 border-b border-gray-200 dark:border-gray-800">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-[#D6B858] uppercase tracking-wider block">
                  📑 Índice de Navegación
                </span>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                  {activeBook?.title}
                </h3>
                <p className="text-xs text-gray-500">Por {activeBook?.author}</p>
              </div>
              <button
                onClick={() => engine.toggleSidebar()}
                className="p-1 text-gray-400 hover:text-gray-600 text-xs font-bold"
                title="Colapsar Índice"
              >
                ◀
              </button>
            </div>

            {/* Saved Bookmarks Section if exist */}
            {studentProgress?.bookmarks && studentProgress.bookmarks.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 p-3 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-[#D6B858]" />
                  <span>Tus Marcadores ({studentProgress.bookmarks.length})</span>
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {studentProgress.bookmarks.map((bm) => (
                    <button
                      key={bm.id}
                      onClick={() => engine.jumpToChapter(bm.chapterIndex)}
                      className="w-full text-left p-1.5 rounded hover:bg-amber-100 dark:hover:bg-amber-900/60 text-xs transition-colors block truncate"
                    >
                      <strong className="text-amber-900 dark:text-amber-200 block text-[11px]">{bm.chapterTitle}</strong>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Input inside book */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar en el libro..."
                value={readerState?.searchQuery || ""}
                onChange={(e) => engine.executeSearch(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#D6B858]"
              />
            </div>

            {/* TOC List of Chapters */}
            <div className="space-y-1.5 flex-1">
              {activeBook?.chapters.map((chap, idx) => {
                const isActive = readerState?.currentChapterIndex === idx;
                const isBookmarked = studentProgress?.bookmarks.some((b) => b.chapterIndex === idx);

                return (
                  <button
                    key={chap.id}
                    onClick={() => engine.jumpToChapter(idx)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                      isActive
                        ? "bg-[#D6B858]/20 border-[#D6B858] font-bold text-[#725c00] dark:text-[#D6B858] shadow-xs"
                        : "bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/80 border-transparent text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-[#D6B858]">#{chap.number}</span>
                        {isBookmarked && <Bookmark className="w-3 h-3 text-[#D6B858] fill-[#D6B858]" />}
                      </div>
                      {chap.estimatedReadTimeMinutes && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {chap.estimatedReadTimeMinutes} min
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-semibold mt-1 leading-snug">{chap.title}</h4>
                    {chap.subtitle && (
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{chap.subtitle}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Main Content Reading Canvas (Secured with Watermark & Protected View) */}
        <main
          className={`flex-1 overflow-y-auto p-6 md:p-12 relative select-none transition-all ${
            isDevToolsDetected ? "filter blur-md pointer-events-none" : ""
          }`}
          style={{
            backgroundImage: `url("${watermarkSVG}")`,
            backgroundRepeat: "repeat",
          }}
          onContextMenu={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
        >
          {currentChapter ? (
            <div
              className="max-w-3xl mx-auto space-y-6 pb-24 transition-all"
              style={{
                fontSize: `${(18 * zoom) / 100}px`,
                lineHeight: "1.8",
              }}
            >
              {/* Chapter Header Card */}
              <div className="border-b border-gray-300 dark:border-gray-700 pb-6 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-[#D6B858] uppercase tracking-widest">
                  <span>{activeBook?.title} — {currentChapter.title}</span>
                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full border border-amber-300/40">
                    Página {currentPageIndex + 1} de {totalPagesInChapter}
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-serif">
                  {currentChapter.title}
                </h1>
                {currentChapter.subtitle && (
                  <p className="text-base text-gray-600 dark:text-gray-400 italic">
                    {currentChapter.subtitle}
                  </p>
                )}
              </div>

              {/* Protected Chapter Content Body - Paginated Paragraphs & Rich HTML Cards */}
              <div className="prose prose-amber dark:prose-invert max-w-none font-serif leading-relaxed space-y-6 min-h-[350px]">
                {currentPageParagraphs.map((paragraph, pIdx) => {
                  if (paragraph.startsWith("<div") || paragraph.startsWith("<h3") || paragraph.startsWith("<blockquote") || paragraph.startsWith("<ul") || paragraph.startsWith("<table")) {
                    return <div key={pIdx} dangerouslySetInnerHTML={{ __html: paragraph }} />;
                  }
                  return (
                    <p key={pIdx} className="text-justify font-serif leading-relaxed font-normal tracking-normal text-gray-900 dark:text-gray-100">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Page-by-Page Pagination Footer */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handlePrevPage}
                  disabled={readerState?.currentChapterIndex === 0 && currentPageIndex === 0}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    readerState?.currentChapterIndex === 0 && currentPageIndex === 0
                      ? "opacity-30 cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-[#D6B858]/20 shadow-xs"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>◀ Página Anterior</span>
                </button>

                <div className="text-center">
                  <span className="text-xs font-mono font-bold text-[#D6B858] block">
                    Página {currentPageIndex + 1} de {totalPagesInChapter}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono block">
                    Usa las flechas ◀ ▶ del teclado para cambiar de página
                  </span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={
                    readerState?.currentChapterIndex === (activeBook?.chapters.length || 1) - 1 &&
                    currentPageIndex === totalPagesInChapter - 1
                  }
                  className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                    readerState?.currentChapterIndex === (activeBook?.chapters.length || 1) - 1 &&
                    currentPageIndex === totalPagesInChapter - 1
                      ? "opacity-30 cursor-not-allowed bg-gray-300 text-gray-600"
                      : "bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19]"
                  }`}
                >
                  <span>Página Siguiente ▶</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Watermark Banner Footer */}
              <div className="pt-6 text-center">
                <span className="text-xs font-bold text-amber-800/40 dark:text-amber-300/40 uppercase tracking-widest border border-amber-500/20 px-4 py-1.5 rounded-full">
                  CONFIDENCIAL — {studentDisplayName} — NO COPIAR
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 space-y-4">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-gray-500 text-sm">Selecciona un libro para iniciar la lectura.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
