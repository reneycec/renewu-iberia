/**
 * BookReaderEngine Class (Object-Oriented Design)
 * Encapsulates state management, navigation logic, table of contents navigation,
 * search filtering, progress tracking, and theme state for the eBook Viewer.
 */

import { BookItem, BookChapter } from "../types";

export type ReaderTheme = "light" | "sepia" | "dark";

export interface ReaderState {
  book: BookItem | null;
  currentChapterIndex: number;
  zoomLevel: number; // 90 to 150
  theme: ReaderTheme;
  searchQuery: string;
  searchResults: { chapterIndex: number; chapterTitle: string; snippet: string }[];
  isSidebarOpen: boolean;
  fontSize: number; // in pixels, e.g. 16, 18, 20
}

export type ReaderStateChangeListener = (state: ReaderState) => void;

export class BookReaderEngine {
  private state: ReaderState = {
    book: null,
    currentChapterIndex: 0,
    zoomLevel: 100,
    theme: "sepia",
    searchQuery: "",
    searchResults: [],
    isSidebarOpen: true,
    fontSize: 18,
  };

  private listeners: ReaderStateChangeListener[] = [];

  constructor(initialBook?: BookItem | null) {
    if (initialBook) {
      this.loadBook(initialBook);
    }
  }

  /**
   * Subscribe to state updates (Observer pattern)
   */
  public subscribe(listener: ReaderStateChangeListener): () => void {
    this.listeners.push(listener);
    // Call immediately with initial state
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  /**
   * Load a new book into the engine
   */
  public loadBook(book: BookItem): void {
    this.state.book = book;
    this.state.currentChapterIndex = 0;
    this.state.searchQuery = "";
    this.state.searchResults = [];
    this.notify();
  }

  /**
   * Get current state snapshot
   */
  public getState(): ReaderState {
    return { ...this.state };
  }

  /**
   * Get active chapter object
   */
  public getCurrentChapter(): BookChapter | null {
    if (!this.state.book || !this.state.book.chapters.length) return null;
    return this.state.book.chapters[this.state.currentChapterIndex] || null;
  }

  /**
   * Navigation: Jump to chapter by index (Index de Navegación)
   */
  public jumpToChapter(index: number): boolean {
    if (!this.state.book || index < 0 || index >= this.state.book.chapters.length) {
      return false;
    }
    this.state.currentChapterIndex = index;
    this.notify();
    return true;
  }

  /**
   * Navigation: Jump to next chapter
   */
  public nextChapter(): boolean {
    if (!this.state.book) return false;
    if (this.state.currentChapterIndex < this.state.book.chapters.length - 1) {
      this.state.currentChapterIndex++;
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * Navigation: Jump to previous chapter
   */
  public prevChapter(): boolean {
    if (!this.state.book) return false;
    if (this.state.currentChapterIndex > 0) {
      this.state.currentChapterIndex--;
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * Zoom & Font size adjustments
   */
  public setZoom(zoomLevel: number): void {
    const clamped = Math.max(80, Math.min(180, zoomLevel));
    this.state.zoomLevel = clamped;
    this.notify();
  }

  public setFontSize(size: number): void {
    const clamped = Math.max(14, Math.min(26, size));
    this.state.fontSize = clamped;
    this.notify();
  }

  /**
   * Theme switcher
   */
  public setTheme(theme: ReaderTheme): void {
    this.state.theme = theme;
    this.notify();
  }

  /**
   * Toggle table of contents sidebar
   */
  public toggleSidebar(): void {
    this.state.isSidebarOpen = !this.state.isSidebarOpen;
    this.notify();
  }

  /**
   * Search query execution across all book chapters
   */
  public executeSearch(query: string): void {
    this.state.searchQuery = query;
    if (!query.trim() || !this.state.book) {
      this.state.searchResults = [];
      this.notify();
      return;
    }

    const cleanQuery = query.toLowerCase().trim();
    const results: { chapterIndex: number; chapterTitle: string; snippet: string }[] = [];

    this.state.book.chapters.forEach((chapter, idx) => {
      const lowerContent = chapter.content.toLowerCase();
      const pos = lowerContent.indexOf(cleanQuery);
      if (pos !== -1) {
        const start = Math.max(0, pos - 40);
        const end = Math.min(chapter.content.length, pos + 60);
        const rawSnippet = chapter.content.substring(start, end).replace(/\n/g, " ");
        results.push({
          chapterIndex: idx,
          chapterTitle: chapter.title,
          snippet: `...${rawSnippet}...`,
        });
      }
    });

    this.state.searchResults = results;
    this.notify();
  }

  /**
   * Calculate reading progress percentage
   */
  public calculateProgress(): number {
    if (!this.state.book || !this.state.book.chapters.length) return 0;
    const current = this.state.currentChapterIndex + 1;
    const total = this.state.book.chapters.length;
    return Math.round((current / total) * 100);
  }

  /**
   * Calculate estimated remaining read time in minutes
   */
  public calculateRemainingTime(): number {
    if (!this.state.book) return 0;
    let totalMinutes = 0;
    for (let i = this.state.currentChapterIndex; i < this.state.book.chapters.length; i++) {
      totalMinutes += this.state.book.chapters[i].estimatedReadTimeMinutes || 10;
    }
    return totalMinutes;
  }
}
