/**
 * PDFProcessorService Class (Object-Oriented Design)
 * Parses raw text extracted from uploaded PDF files into structured BookItem
 * objects, auto-detecting chapter headings, subtitles, and page counts.
 */

import { BookItem, BookChapter } from "../types";

export class PDFProcessorService {
  private static instance: PDFProcessorService | null = null;

  private constructor() {}

  public static getInstance(): PDFProcessorService {
    if (!PDFProcessorService.instance) {
      PDFProcessorService.instance = new PDFProcessorService();
    }
    return PDFProcessorService.instance;
  }

  /**
   * Parse extracted raw PDF text into a structured BookItem object with chapters
   */
  public parsePDFText(rawText: string, meta: Partial<BookItem>): BookItem {
    const bookId = meta.id || `book-pdf-${Date.now().toString().slice(-6)}`;
    const title = meta.title || "Libro PDF Procesado";
    const author = meta.author || "Autor Desconocido";

    // Split text by common chapter and index delimiters (e.g. "Capítulo", "CONTENIDO", "Contenido", "contenido", "Índice", "Indice", "indice", "SECCIÓN", "PARTE")
    const chapterRegex = /(?=(?:Capítulo|Capitulo|Chapter|Canto|CONTENIDO|Contenido|contenido|CONTENIDOS|Contenidos|contenidos|Índice|INDICE|Indice|indice|Tabla de Contenidos|SECCIÓN|PARTE|#+)(?:\s+[0-9IVXLCDM]+|\b))/i;
    const rawChunks = rawText.split(chapterRegex).filter((chunk) => chunk.trim().length > 0);

    const chapters: BookChapter[] = [];

    if (rawChunks.length > 1) {
      rawChunks.forEach((chunk, idx) => {
        const lines = chunk.trim().split("\n");
        const chapterHeaderLine = lines[0] || `Capítulo ${idx + 1}`;
        const bodyText = lines.slice(1).join("\n").trim() || chunk.trim();

        // Calculate estimated read time (~200 words per minute)
        const wordCount = bodyText.split(/\s+/).length;
        const readTimeMinutes = Math.max(3, Math.ceil(wordCount / 200));

        chapters.push({
          id: `pdf-chap-${idx + 1}-${Date.now()}`,
          number: idx + 1,
          title: chapterHeaderLine.replace(/^#+\s*/, "").trim(),
          subtitle: lines[1] && lines[1].length < 60 ? lines[1].trim() : `Sección ${idx + 1}`,
          estimatedReadTimeMinutes: readTimeMinutes,
          content: bodyText,
        });
      });
    } else {
      // Single chunk fallback: Split into logical pages/parts every ~1000 words
      const paragraphs = rawText.split(/\n\s*\n/);
      let currentChunkText = "";
      let chapterCounter = 1;

      paragraphs.forEach((p) => {
        currentChunkText += p + "\n\n";
        if (currentChunkText.length > 2500) {
          const wordCount = currentChunkText.split(/\s+/).length;
          chapters.push({
            id: `pdf-chap-${chapterCounter}-${Date.now()}`,
            number: chapterCounter,
            title: `Capítulo ${chapterCounter}: Sección de Lectura`,
            subtitle: `Parte ${chapterCounter}`,
            estimatedReadTimeMinutes: Math.max(3, Math.ceil(wordCount / 200)),
            content: currentChunkText.trim(),
          });
          chapterCounter++;
          currentChunkText = "";
        }
      });

      if (currentChunkText.trim()) {
        const wordCount = currentChunkText.split(/\s+/).length;
        chapters.push({
          id: `pdf-chap-${chapterCounter}-${Date.now()}`,
          number: chapterCounter,
          title: `Capítulo ${chapterCounter}: Final del Documento`,
          subtitle: `Conclusión`,
          estimatedReadTimeMinutes: Math.max(2, Math.ceil(wordCount / 200)),
          content: currentChunkText.trim(),
        });
      }
    }

    return {
      id: bookId,
      title,
      subtitle: meta.subtitle || "Documento PDF Procesado e Indizado",
      author,
      year: meta.year || new Date().getFullYear().toString(),
      category: meta.category || "General",
      accessRule: meta.accessRule || "registered_only",
      publishedAt: new Date().toISOString().split("T")[0],
      totalPages: chapters.length,
      coverImage: meta.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      description: meta.description || "Libro cargado desde un documento PDF local y securizado para lectura en línea.",
      chapters: chapters.length > 0 ? chapters : [
        {
          id: `pdf-chap-1-${Date.now()}`,
          number: 1,
          title: "Capítulo 1: Documento Completo",
          subtitle: "Lectura General",
          estimatedReadTimeMinutes: 10,
          content: rawText,
        }
      ],
    };
  }
}
