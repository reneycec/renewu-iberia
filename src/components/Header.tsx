import React from "react";
import { ViewMode } from "../types";
import { GraduationCap, Database, Bot, Layout, CreditCard, FileText, Globe, BookOpen, Info } from "lucide-react";

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isIframeEmbedded?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  isIframeEmbedded = false,
}) => {
  return (
    <header className="bg-white border-b border-[#D6B858] sticky top-0 z-50 shadow-xs">
      {isIframeEmbedded && (
        <div className="bg-[#1A1A19] text-[#D6B858] text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
          <Globe className="w-3.5 h-3.5" />
          <span>Modo Integración Moodle LMS (Iframe Activo) — Sincronización postMessage Habilitada</span>
        </div>
      )}
      <div className="flex flex-col lg:flex-row justify-between items-center w-full px-4 md:px-8 py-3.5 max-w-7xl mx-auto gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onViewChange("courses")}
          className="cursor-pointer flex items-center gap-2 text-2xl md:text-3xl font-extrabold text-[#1A1A19] tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-lg bg-[#1A1A19] flex items-center justify-center text-[#D6B858] font-black text-xl shadow-sm border border-[#D6B858]/40">
            R
          </div>
          <span>Renew<span className="text-[#D6B858]">U</span></span>
          <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider bg-[#D6B858]/15 text-[#725c00] px-2.5 py-0.5 rounded-full border border-[#D6B858]/30 ml-1">
            Certificate Portal
          </span>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm font-semibold">
          <button
            onClick={() => onViewChange("courses")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentView === "courses"
                ? "text-[#725c00] bg-[#D6B858]/20 border-b-2 border-[#D6B858] font-bold"
                : "text-gray-600 hover:text-[#725c00] hover:bg-gray-100"
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#D6B858]" />
            <span>Cursos</span>
          </button>

          <button
            onClick={() => onViewChange("about")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentView === "about"
                ? "text-[#725c00] bg-[#D6B858]/20 border-b-2 border-[#D6B858] font-bold"
                : "text-gray-600 hover:text-[#725c00] hover:bg-gray-100"
            }`}
          >
            <Info className="w-4 h-4 text-[#D6B858]" />
            <span>Nosotros</span>
          </button>

          <button
            onClick={() => onViewChange("enrollment")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentView === "enrollment"
                ? "text-[#725c00] bg-[#D6B858]/20 border-b-2 border-[#D6B858] font-bold"
                : "text-gray-600 hover:text-[#725c00] hover:bg-gray-100"
            }`}
          >
            <FileText className="w-4 h-4 text-[#D6B858]" />
            <span>Inscripción</span>
          </button>

          <button
            onClick={() => onViewChange("checkout")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentView === "checkout"
                ? "text-[#725c00] bg-[#D6B858]/20 border-b-2 border-[#D6B858] font-bold"
                : "text-gray-600 hover:text-[#725c00] hover:bg-gray-100"
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#D6B858]" />
            <span>Pago</span>
          </button>

          <button
            onClick={() => onViewChange("moodle_admin")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentView === "moodle_admin"
                ? "text-[#725c00] bg-[#D6B858]/20 border-b-2 border-[#D6B858] font-bold"
                : "text-gray-600 hover:text-[#725c00] hover:bg-gray-100"
            }`}
          >
            <Database className="w-4 h-4 text-[#D6B858]" />
            <span>Admin & Sync</span>
          </button>

          <button
            onClick={() => onViewChange("ai_tutor")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentView === "ai_tutor"
                ? "text-[#725c00] bg-[#D6B858]/20 border-b-2 border-[#D6B858] font-bold"
                : "text-gray-600 hover:text-[#725c00] hover:bg-gray-100"
            }`}
          >
            <Bot className="w-4 h-4 text-[#D6B858]" />
            <span>Tutor IA</span>
          </button>

          <button
            onClick={() => onViewChange("iframe_mode")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentView === "iframe_mode"
                ? "text-[#725c00] bg-[#D6B858]/20 border-b-2 border-[#D6B858] font-bold"
                : "text-gray-600 hover:text-[#725c00] hover:bg-gray-100"
            }`}
          >
            <Layout className="w-4 h-4 text-[#D6B858]" />
            <span>Iframe / LMS</span>
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onViewChange("courses")}
            className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black text-xs md:text-sm px-4 py-2 rounded-md shadow-xs transition-all active:scale-95 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Catálogo Cursos</span>
          </button>
        </div>
      </div>
    </header>
  );
};

