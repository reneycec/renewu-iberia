import React, { useState, useEffect } from "react";
import { BookItem, BookChapter, BookAccessRule } from "../types";
import { BookCatalogService } from "../services/BookCatalogService";
import { PDFProcessorService } from "../services/PDFProcessorService";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Upload,
  CheckCircle2,
  Lock,
  Layers,
  FileText,
  Eye,
  ShieldCheck,
  List,
  FileCheck,
  Sparkles,
  AlertCircle
} from "lucide-react";

export const BookAdminManager: React.FC = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form modal state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isProcessingPDF, setIsProcessingPDF] = useState<boolean>(false);
  const [activeBook, setActiveBook] = useState<Partial<BookItem>>({
    title: "",
    subtitle: "",
    author: "",
    category: "Estudios Bíblicos",
    courseId: "BIB-101",
    courseName: "Introducción a la Hermenéutica Bíblica",
    accessRule: "registered_only",
    description: "",
    coverImage: "",
    chapters: [],
  });

  // Chapter editing scratchpad
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterSubtitle, setNewChapterSubtitle] = useState("");
  const [newChapterContent, setNewChapterContent] = useState("");
  const [newChapterReadTime, setNewChapterReadTime] = useState(15);

  const catalogService = BookCatalogService.getInstance();
  const pdfProcessor = PDFProcessorService.getInstance();

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    const data = await catalogService.fetchBooks();
    setBooks(data);
    setLoading(false);
  };

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setActiveBook({
      id: `book-${Date.now().toString().slice(-6)}`,
      title: "",
      subtitle: "",
      author: "",
      category: "Estudios Bíblicos",
      courseId: "BIB-101",
      courseName: "Introducción a la Hermenéutica Bíblica",
      accessRule: "registered_only",
      description: "",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      publishedAt: new Date().toISOString().split("T")[0],
      chapters: [],
    });
    setEditingChapterId(null);
    setNewChapterTitle("");
    setNewChapterSubtitle("");
    setNewChapterContent("");
    setIsEditing(true);
  };

  const handleOpenEditModal = (book: BookItem) => {
    setActiveBook(JSON.parse(JSON.stringify(book)));
    setEditingChapterId(null);
    setNewChapterTitle("");
    setNewChapterSubtitle("");
    setNewChapterContent("");
    setIsEditing(true);
  };

  const handleStartEditChapter = (chap: BookChapter) => {
    setEditingChapterId(chap.id);
    setNewChapterTitle(chap.title);
    setNewChapterSubtitle(chap.subtitle || "");
    setNewChapterContent(chap.content || "");
    setNewChapterReadTime(chap.estimatedReadTimeMinutes || 15);
  };

  const handleAddOrUpdateChapter = () => {
    if (!newChapterTitle.trim()) {
      showNotification("Por favor ingresa un título para el capítulo", "error");
      return;
    }

    const currentChapters = activeBook.chapters || [];

    if (editingChapterId) {
      // Update existing chapter
      const updatedChapters = currentChapters.map((c) =>
        c.id === editingChapterId
          ? {
              ...c,
              title: newChapterTitle,
              subtitle: newChapterSubtitle,
              content: newChapterContent,
              estimatedReadTimeMinutes: newChapterReadTime,
            }
          : c
      );
      setActiveBook({ ...activeBook, chapters: updatedChapters });
      showNotification("¡Capítulo modificado y actualizado!");
    } else {
      // Add new chapter
      const nextNumber = currentChapters.length + 1;
      const newChap: BookChapter = {
        id: `chap-${Date.now()}-${nextNumber}`,
        number: nextNumber,
        title: newChapterTitle,
        subtitle: newChapterSubtitle,
        estimatedReadTimeMinutes: newChapterReadTime,
        content: newChapterContent || "Contenido en edición...",
      };
      setActiveBook({
        ...activeBook,
        chapters: [...currentChapters, newChap],
      });
      showNotification("Capítulo agregado al índice preliminar.");
    }

    setEditingChapterId(null);
    setNewChapterTitle("");
    setNewChapterSubtitle("");
    setNewChapterContent("");
    setNewChapterReadTime(15);
  };

  /**
   * Device File Picker Handler (.pdf or .txt)
   */
  const handlePDFFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingPDF(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const base64Data = (event.target?.result as string) || "";

        const response = await fetch("/api/books/upload-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pdfBase64: base64Data,
            filename: file.name,
            title: activeBook.title || file.name.replace(/\.[^/.]+$/, ""),
            author: activeBook.author || "Autor Desconocido",
            category: activeBook.category || "Estudios Bíblicos",
          }),
        });

        const data = await response.json();

        if (data.success && data.book) {
          setActiveBook((prev) => ({
            ...prev,
            title: prev.title || data.book.title,
            author: prev.author || data.book.author,
            chapters: data.book.chapters,
            description: prev.description || data.book.description,
          }));

          showNotification(`¡PDF "${file.name}" procesado con éxito! Se extrajeron ${data.book.chapters.length} capítulos.`);
        } else {
          showNotification(data.message || "Error al procesar el archivo PDF.", "error");
        }
      } catch (err: any) {
        showNotification(`Error de conexión al procesar el PDF: ${err.message}`, "error");
      } finally {
        setIsProcessingPDF(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleAddChapterToActiveBook = () => {
    if (!newChapterTitle.trim()) {
      showNotification("Por favor ingresa un título para el capítulo", "error");
      return;
    }

    const currentChapters = activeBook.chapters || [];
    const nextNumber = currentChapters.length + 1;
    const newChap: BookChapter = {
      id: `chap-${Date.now()}-${nextNumber}`,
      number: nextNumber,
      title: newChapterTitle,
      subtitle: newChapterSubtitle,
      estimatedReadTimeMinutes: newChapterReadTime,
      content: newChapterContent || "Contenido en edición...",
    };

    setActiveBook({
      ...activeBook,
      chapters: [...currentChapters, newChap],
    });

    setNewChapterTitle("");
    setNewChapterSubtitle("");
    setNewChapterContent("");
    setNewChapterReadTime(15);
    showNotification("Capítulo agregado al índice preliminar.");
  };

  const handleDeleteChapter = (chapId: string) => {
    const updated = (activeBook.chapters || []).filter((c) => c.id !== chapId);
    const renumbered = updated.map((c, index) => ({ ...c, number: index + 1 }));
    setActiveBook({ ...activeBook, chapters: renumbered });
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBook.title || !activeBook.author) {
      showNotification("El título y el autor son requeridos.", "error");
      return;
    }

    const finalBook: BookItem = {
      id: activeBook.id || `book-${Date.now()}`,
      title: activeBook.title || "Sin título",
      subtitle: activeBook.subtitle || "",
      author: activeBook.author || "RenewU Faculty",
      category: activeBook.category || "General",
      courseId: activeBook.courseId,
      courseName: activeBook.courseName,
      accessRule: (activeBook.accessRule as BookAccessRule) || "registered_only",
      publishedAt: activeBook.publishedAt || new Date().toISOString().split("T")[0],
      totalPages: activeBook.chapters?.length || 1,
      coverImage: activeBook.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      description: activeBook.description || "",
      chapters: activeBook.chapters || [],
    };

    const res = await catalogService.saveBook(finalBook);
    if (res.success) {
      showNotification("¡Libro guardado y publicado en la biblioteca virtual!");
      setIsEditing(false);
      loadCatalog();
    } else {
      showNotification(res.message || "Error al guardar el libro", "error");
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm("¿Estás seguro de eliminar este libro de la biblioteca?")) {
      const res = await catalogService.deleteBook(bookId);
      if (res.success) {
        showNotification("Libro eliminado con éxito.");
        loadCatalog();
      } else {
        showNotification("Error al eliminar el libro.", "error");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Toast Notification Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-bold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : "bg-red-50 text-red-800 border-red-300"
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Admin Title Header */}
      <div className="bg-[#1A1A19] text-white p-6 md:p-8 rounded-2xl border-2 border-[#D6B858] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#D6B858] text-[#1A1A19] text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
              Sección Oculta de Administración
            </span>
            <span className="text-gray-400 text-xs">• Carga de PDF y Control de Permisos</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#D6B858]" />
            <span>Gestión de Libros del Curso RenewU</span>
          </h2>
          <p className="text-xs text-gray-400">
            Selecciona un archivo PDF de tu dispositivo para convertirlo automáticamente a un libro estructurado o configúralo manualmente.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Subir Nuevo Libro / PDF</span>
        </button>
      </div>

      {/* Book Catalog Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#D6B858]" />
          <span>Catálogo Activo de Libros ({books.length})</span>
        </h3>

        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm">Cargando biblioteca...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Category & Access Rule badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-[#D6B858]/20 text-[#725c00] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-[#D6B858]/30">
                      {book.category}
                    </span>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-600" />
                      <span>{book.accessRule === "registered_only" ? "Solo Registrados" : "Acceso Libre"}</span>
                    </span>
                  </div>

                  {/* Book Title & Author */}
                  <h4 className="font-extrabold text-base text-gray-900 leading-snug line-clamp-2">
                    {book.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">Por {book.author}</p>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Footer metadata & buttons */}
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-semibold flex items-center gap-1">
                    <List className="w-3.5 h-3.5 text-[#D6B858]" />
                    {book.chapters.length} Capítulos
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(book)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                      title="Editar Libro e Índice"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                      title="Eliminar Libro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload & Edit Modal Drawer */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border-2 border-[#D6B858] max-w-4xl w-full p-6 md:p-8 shadow-2xl space-y-6 my-8 animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2 text-[#1A1A19]">
                <Upload className="w-6 h-6 text-[#D6B858]" />
                <h3 className="font-extrabold text-xl">
                  {activeBook.id ? "Configurar Libro e Índice" : "Subir Nuevo Libro / Cargar PDF"}
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Device PDF File Selector Box */}
            <div className="bg-[#D6B858]/10 border-2 border-dashed border-[#D6B858] rounded-2xl p-6 text-center space-y-3 relative hover:bg-[#D6B858]/15 transition-all">
              <Upload className="w-8 h-8 text-[#D6B858] mx-auto animate-bounce" />
              <div>
                <h4 className="font-bold text-sm text-[#1A1A19]">
                  Seleccionar Archivo PDF de tu Dispositivo
                </h4>
                <p className="text-xs text-gray-500">
                  Haz clic aquí para examinar tus archivos locales (.pdf o .txt). El servidor procesará el documento y extraerá el índice de capítulos automáticamente.
                </p>
              </div>

              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handlePDFFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              {isProcessingPDF && (
                <div className="text-xs font-bold text-[#725c00] flex items-center justify-center gap-2 pt-2">
                  <Sparkles className="w-4 h-4 animate-spin text-[#D6B858]" />
                  <span>Procesando y extrayendo capítulos del PDF...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveBook} className="space-y-6">
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">Título del Libro *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Hermenéutica Bíblica Avanzada"
                    value={activeBook.title}
                    onChange={(e) => setActiveBook({ ...activeBook, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#D6B858]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">Subtítulo</label>
                  <input
                    type="text"
                    placeholder="Ej. Compendio académico 2026"
                    value={activeBook.subtitle}
                    onChange={(e) => setActiveBook({ ...activeBook, subtitle: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#D6B858]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">Autor / Creador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Dr. R.C. Sproul & Equipo RenewU"
                    value={activeBook.author}
                    onChange={(e) => setActiveBook({ ...activeBook, author: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#D6B858]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">Categoría Académica</label>
                  <select
                    value={activeBook.category}
                    onChange={(e) => setActiveBook({ ...activeBook, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#D6B858]"
                  >
                    <option value="Estudios Bíblicos">Estudios Bíblicos</option>
                    <option value="Teología Sistemática">Teología Sistemática</option>
                    <option value="Ministerio Práctico">Ministerio Práctico</option>
                    <option value="Historia de la Iglesia">Historia de la Iglesia</option>
                    <option value="Literatura Clásica">Literatura Clásica</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">Regla de Acceso y Seguridad</label>
                  <select
                    value={activeBook.accessRule}
                    onChange={(e) =>
                      setActiveBook({
                        ...activeBook,
                        accessRule: e.target.value as BookAccessRule,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#D6B858] font-bold text-[#725c00]"
                  >
                    <option value="registered_only">🔒 Solo Estudiantes Registrados (Recomendado)</option>
                    <option value="paid_only">💳 Solo Alumnos con Matrícula Pagada</option>
                    <option value="public">🌐 Acceso Libre</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">URL de Portada (Opcional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={activeBook.coverImage}
                    onChange={(e) => setActiveBook({ ...activeBook, coverImage: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#D6B858]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Resumen / Descripción Breve</label>
                <textarea
                  rows={2}
                  value={activeBook.description}
                  onChange={(e) => setActiveBook({ ...activeBook, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#D6B858]"
                  placeholder="Escribe la sinopsis del libro..."
                />
              </div>

              {/* Chapter & Table of Contents Builder Section */}
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <List className="w-4 h-4 text-[#D6B858]" />
                    <span>Índice de Navegación ({activeBook.chapters?.length || 0} Capítulos Extraídos)</span>
                  </h4>
                </div>

                {/* Existing Chapters List */}
                <div className="space-y-2 max-h-56 overflow-y-auto bg-gray-50 border border-gray-200 p-3 rounded-xl">
                  {activeBook.chapters && activeBook.chapters.length > 0 ? (
                    activeBook.chapters.map((chap) => (
                      <div
                        key={chap.id}
                        className={`p-3 rounded-lg border flex justify-between items-center gap-2 transition-all ${
                          editingChapterId === chap.id
                            ? "bg-amber-50 border-[#D6B858] ring-2 ring-[#D6B858]/30"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-[#D6B858]">Capítulo {chap.number}: </span>
                          <strong className="text-xs text-gray-800">{chap.title}</strong>
                          <span className="text-[10px] text-gray-500 block truncate">{chap.subtitle}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditChapter(chap)}
                            className="p-1.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Modificar Capítulo"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#D6B858]" />
                            <span>Modificar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteChapter(chap.id)}
                            className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                            title="Eliminar Capítulo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Aún no hay capítulos. Selecciona un PDF arriba para extraer los capítulos o agrégalos manualmente.
                    </p>
                  )}
                </div>

                {/* Add New or Edit Existing Chapter Builder Card */}
                <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-bold text-amber-900">
                      {editingChapterId ? "✏️ Modificando Capítulo Seleccionado:" : "➕ Agregar Nuevo Capítulo al Libro:"}
                    </h5>
                    {editingChapterId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingChapterId(null);
                          setNewChapterTitle("");
                          setNewChapterSubtitle("");
                          setNewChapterContent("");
                        }}
                        className="text-[11px] text-gray-500 hover:text-gray-700 font-bold underline"
                      >
                        Cancelar Edición
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Título del Capítulo (ej. Capítulo 4: Las Epístolas)"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      className="bg-white border border-amber-300 rounded-lg p-2 text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Subtítulo o descripción breve"
                      value={newChapterSubtitle}
                      onChange={(e) => setNewChapterSubtitle(e.target.value)}
                      className="bg-white border border-amber-300 rounded-lg p-2 text-xs outline-none"
                    />
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Escribe o modifica aquí el contenido de lectura del capítulo (texto plano o párrafos HTML)..."
                    value={newChapterContent}
                    onChange={(e) => setNewChapterContent(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs outline-none font-sans leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={handleAddOrUpdateChapter}
                    className="bg-[#1A1A19] hover:bg-gray-800 text-[#D6B858] font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {editingChapterId ? <Save className="w-4 h-4 text-[#D6B858]" /> : <Plus className="w-4 h-4 text-[#D6B858]" />}
                    <span>{editingChapterId ? "Guardar Modificaciones del Capítulo" : "Añadir Capítulo al Libro"}</span>
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-gray-200 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black py-3 rounded-xl text-xs shadow-md uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Publicar Libro en Biblioteca</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
