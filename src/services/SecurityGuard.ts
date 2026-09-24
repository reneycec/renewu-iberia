/**
 * SecurityGuard Class (Object-Oriented Design)
 * Manages client-side anti-download, anti-print, anti-copy protection,
 * keyboard shortcut suppression, DevTools detection, and dynamic security watermark rendering.
 */

export interface SecurityConfig {
  preventRightClick: boolean;
  preventCopy: boolean;
  preventPrint: boolean;
  preventShortcuts: boolean;
  watermarkText: string;
}

export type DevToolsListener = (isOpen: boolean) => void;

export class SecurityGuard {
  private static instance: SecurityGuard | null = null;
  private isProtected: boolean = false;
  private styleElement: HTMLStyleElement | null = null;
  private devToolsCheckInterval: any = null;
  private debuggerCheckInterval: any = null;
  private isDevToolsOpen: boolean = false;
  private devToolsListeners: DevToolsListener[] = [];

  private config: SecurityConfig = {
    preventRightClick: true,
    preventCopy: true,
    preventPrint: true,
    preventShortcuts: true,
    watermarkText: "CONFIDENCIAL — NO COPIAR",
  };

  private constructor() {}

  /**
   * Singleton pattern to ensure global state control over security guard.
   */
  public static getInstance(): SecurityGuard {
    if (!SecurityGuard.instance) {
      SecurityGuard.instance = new SecurityGuard();
    }
    return SecurityGuard.instance;
  }

  public onDevToolsChange(listener: DevToolsListener): () => void {
    this.devToolsListeners.push(listener);
    listener(this.isDevToolsOpen);
    return () => {
      this.devToolsListeners = this.devToolsListeners.filter((l) => l !== listener);
    };
  }

  private notifyDevTools(isOpen: boolean): void {
    if (this.isDevToolsOpen !== isOpen) {
      this.isDevToolsOpen = isOpen;
      this.devToolsListeners.forEach((l) => l(isOpen));
    }
  }

  /**
   * Enable security protection and attach listeners
   */
  public enableProtection(config?: Partial<SecurityConfig>): void {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    if (this.isProtected) return;
    this.isProtected = true;

    // Attach event listeners
    window.addEventListener("contextmenu", this.handleContextMenu, true);
    window.addEventListener("keydown", this.handleKeyDown, true);
    window.addEventListener("copy", this.handleCopy, true);
    window.addEventListener("cut", this.handleCut, true);
    window.addEventListener("selectstart", this.handleSelectStart, true);
    window.addEventListener("dragstart", this.handleDragStart, true);
    window.addEventListener("beforeprint", this.handleBeforePrint, true);

    // Inject anti-print CSS rule
    this.injectAntiPrintCSS();

    // Start DevTools detection timers
    this.startDevToolsDetection();
  }

  /**
   * Disable security protection and clean up listeners
   */
  public disableProtection(): void {
    if (!this.isProtected) return;
    this.isProtected = false;

    window.removeEventListener("contextmenu", this.handleContextMenu, true);
    window.removeEventListener("keydown", this.handleKeyDown, true);
    window.removeEventListener("copy", this.handleCopy, true);
    window.removeEventListener("cut", this.handleCut, true);
    window.removeEventListener("selectstart", this.handleSelectStart, true);
    window.removeEventListener("dragstart", this.handleDragStart, true);
    window.removeEventListener("beforeprint", this.handleBeforePrint, true);

    this.removeAntiPrintCSS();
    this.stopDevToolsDetection();
  }

  /**
   * DevTools Detection Loops (Dimension Threshold & Debugger Timing)
   */
  private startDevToolsDetection(): void {
    if (typeof window === "undefined") return;
    // Disabled window dimension threshold check to prevent false positives on scaled monitors/sidebars
    this.notifyDevTools(false);
  }

  private stopDevToolsDetection(): void {
    if (this.devToolsCheckInterval) {
      clearInterval(this.devToolsCheckInterval);
      this.devToolsCheckInterval = null;
    }
    if (this.debuggerCheckInterval) {
      clearInterval(this.debuggerCheckInterval);
      this.debuggerCheckInterval = null;
    }
    this.notifyDevTools(false);
  }

  /**
   * Inject strict print suppression CSS stylesheet
   */
  private injectAntiPrintCSS(): void {
    if (!this.styleElement && typeof document !== "undefined") {
      this.styleElement = document.createElement("style");
      this.styleElement.id = "renewu-security-anti-print";
      this.styleElement.innerHTML = `
        @media print {
          html, body, #root {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          body::after {
            content: "LA IMPRESIÓN DE ESTE LIBRO ESTÁ PROHIBIDA POR DERECHOS DE AUTOR - RENEWU IBERIA";
            display: block !important;
            visibility: visible !important;
            font-size: 24pt;
            color: red;
            text-align: center;
            margin-top: 200px;
          }
        }
      `;
      document.head.appendChild(this.styleElement);
    }
  }

  private removeAntiPrintCSS(): void {
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }

  private handleBeforePrint = (e: Event): void => {
    e.preventDefault();
    alert("La impresión de este contenido no está permitida.");
  };

  /**
   * Context Menu (Right-Click) Interceptor
   */
  private handleContextMenu = (e: MouseEvent): void => {
    if (this.config.preventRightClick) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  /**
   * Keyboard Shortcuts Interceptor (Ctrl+P, Ctrl+S, F12, Cmd+P, etc.)
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.config.preventShortcuts) return;

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // Prevent Print (Ctrl+P / Cmd+P)
    if (isCtrlOrCmd && key === "p") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Prevent Save (Ctrl+S / Cmd+S)
    if (isCtrlOrCmd && key === "s") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Prevent View Source (Ctrl+U)
    if (isCtrlOrCmd && key === "u") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Prevent DevTools (F12 or Ctrl+Shift+I / Cmd+Opt+I / Ctrl+Shift+J)
    if (e.key === "F12" || (isCtrlOrCmd && e.shiftKey && (key === "i" || key === "j" || key === "c"))) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

  private handleCopy = (e: ClipboardEvent): void => {
    if (this.config.preventCopy) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  private handleCut = (e: ClipboardEvent): void => {
    if (this.config.preventCopy) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  private handleSelectStart = (e: Event): void => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
      return;
    }
    if (this.config.preventCopy) {
      e.preventDefault();
    }
  };

  private handleDragStart = (e: Event): void => {
    e.preventDefault();
  };

  /**
   * Generates dynamic SVG pattern string for security watermark background
   */
  public generateWatermarkSVG(watermarkText: string): string {
    const encodedText = encodeURIComponent(watermarkText);
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="350" height="200" viewBox="0 0 350 200"><text x="20" y="100" fill="rgba(214,184,88,0.12)" font-size="13" font-family="sans-serif" font-weight="bold" transform="rotate(-25 100 100)">${encodedText}</text></svg>`;
  }
}
