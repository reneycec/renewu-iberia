/**
 * StudentReadingTracker Class (Object-Oriented Design)
 * Tracks, saves, restores, and synchronizes reading progress, bookmarks,
 * and reading time metrics for registered students across course books.
 */

import { StudentReadingProgress, BookmarkItem } from "../types";

export class StudentReadingTracker {
  private static instance: StudentReadingTracker | null = null;
  private apiEndpoint: string = "/api/student/progress";

  private constructor() {}

  public static getInstance(): StudentReadingTracker {
    if (!StudentReadingTracker.instance) {
      StudentReadingTracker.instance = new StudentReadingTracker();
    }
    return StudentReadingTracker.instance;
  }

  /**
   * Fetch progress for a specific student and book
   */
  public async getProgress(studentId: string, bookId: string): Promise<StudentReadingProgress | null> {
    try {
      const response = await fetch(`${this.apiEndpoint}/${studentId}/${bookId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.progress) {
          return data.progress;
        }
      }
    } catch (err) {
      console.warn("Could not fetch reading progress from server API, checking local storage.", err);
    }

    // LocalStorage Fallback
    const localKey = `renewu_progress_${studentId}_${bookId}`;
    const localData = localStorage.getItem(localKey);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {}
    }

    return null;
  }

  /**
   * Save or update student reading progress
   */
  public async saveProgress(progress: StudentReadingProgress): Promise<boolean> {
    // Save to LocalStorage immediately
    const localKey = `renewu_progress_${progress.studentId}_${progress.bookId}`;
    localStorage.setItem(localKey, JSON.stringify(progress));

    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
      });
      const data = await response.json();
      return data.success;
    } catch (err) {
      console.warn("Error persisting student reading progress to server API.", err);
      return false;
    }
  }

  /**
   * Add a bookmark for a student
   */
  public async addBookmark(
    studentId: string,
    bookId: string,
    chapterIndex: number,
    chapterTitle: string,
    note?: string
  ): Promise<StudentReadingProgress> {
    const current = (await this.getProgress(studentId, bookId)) || {
      studentId,
      bookId,
      lastChapterIndex: chapterIndex,
      progressPercentage: 0,
      totalTimeMinutes: 0,
      bookmarks: [],
      lastReadAt: new Date().toISOString(),
    };

    const newBookmark: BookmarkItem = {
      id: `bm-${Date.now()}`,
      chapterIndex,
      chapterTitle,
      note,
      createdAt: new Date().toISOString(),
    };

    const updatedBookmarks = [...current.bookmarks.filter((b) => b.chapterIndex !== chapterIndex), newBookmark];
    const updatedProgress: StudentReadingProgress = {
      ...current,
      bookmarks: updatedBookmarks,
      lastReadAt: new Date().toISOString(),
    };

    await this.saveProgress(updatedProgress);
    return updatedProgress;
  }
}
