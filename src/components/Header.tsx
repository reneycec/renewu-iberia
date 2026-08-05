import React, { useState } from "react";
import { ViewMode, LanguageCode } from "../types";
import { AVAILABLE_LANGUAGES, Dictionary } from "../data/translations";
import { GraduationCap, Database, Bot, Layout, CreditCard, FileText, Globe, BookOpen, Info, Lock, Unlock, Edit3, X, KeyRound } from "lucide-react";

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isIframeEmbedded?: boolean;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isAdmin: boolean;
  onAdminLogin: (pass: string) => boolean;
  onAdminLogout: () => void;
  t: Dictionary;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  isIframeEmbedded = false,
  currentLanguage,
  onLanguageChange,
  isAdmin,
  onAdminLogin,
  onAdminLogout,
  t,
}) => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAdminLogin(adminPasswordInput);
    if (success) {
      setShowAdminModal(false);
      setAdminPasswordInput("");
      setAdminError("");
      onViewChange("moodle_admin");
    } else {
      setAdminError("Contraseña de administrador incorrecta");
    }
  };

  const activeLangObj = AVAILABLE_LANGUAGES.find((l) => l.code === currentLanguage) || AVAILABLE_LANGUAGES[0];

  return (
    <header className="bg-white border-b border-[#D6B858] sticky top-0 z-50 shadow-xs">
      {isIframeEmbedded && (
        <div className="bg-[#1A1A19] text-[#D6B858] text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
          <Globe className="w-3.5 h-3.5" />
          <span>Modo Integración Moodle LMS (Iframe Activo) — campus.renewu-iberia.com</span>
        </div>
      )}

      {/* Top Bar for Admin Badge & Language Switcher */}
      <div className="bg-gray-900 text-gray-300 text-xs py-1.5 px-4 md:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
                <Unlock className="w-3 h-3" /> Modo Admin Activo
              </span>
            ) : (
              <span className="text-gray-400 text-[11px]">Renew University — Portal Oficial de Certificados</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-0.5 rounded border border-gray-700">
              <Globe className="w-3.5 h-3.5 text-[#D6B858]" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="bg-transparent text-white text-xs outline-none cursor-pointer"
              >
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-gray-900 text-white">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Lock / Unlock Button */}
            {isAdmin ? (
              <button
                onClick={onAdminLogout}
                className="text-[11px] text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Cerrar Modo Admin"
              >
                <Lock className="w-3 h-3" />
                <span>{t.adminLogoutBtn}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAdminModal(true)}
                className="text-[11px] text-gray-400 hover:text-[#D6B858] flex items-center gap-1 transition-colors cursor-pointer"
                title="Acceder como Administrador"
              >
                <Lock className="w-3 h-3" />
                <span>Acceso Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center w-full px-4 md:px-8 py-3.5 max-w-7xl mx-auto gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onViewChange("courses")}
          className="cursor-pointer flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img src="/renewu-logo.png" alt="RenewU Logo" className="h-7 md:h-9 object-contain" />
          <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider bg-[#D6B858]/15 text-[#725c00] px-2.5 py-0.5 rounded-full border border-[#D6B858]/30 ml-1">
            Certificate Portal
          </span>
        </div>

        {/* Navigation Tabs */}
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
            <span>{t.navCourses}</span>
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
            <span>{t.navAbout}</span>
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
            <span>{t.navEnrollment}</span>
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
            <span>{t.navPayment}</span>
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
            <span>{t.navAITutor}</span>
          </button>

          {/* Protected Admin Tabs - Visible ONLY when logged in as Admin */}
          {isAdmin && (
            <>
              <button
                onClick={() => onViewChange("moodle_admin")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  currentView === "moodle_admin"
                    ? "text-[#725c00] bg-[#D6B858]/30 border-b-2 border-[#D6B858] font-bold shadow-xs"
                    : "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <Database className="w-4 h-4 text-[#D6B858]" />
                <span>{t.navMoodleAdmin}</span>
              </button>

              <button
                onClick={() => onViewChange("iframe_mode")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  currentView === "iframe_mode"
                    ? "text-[#725c00] bg-[#D6B858]/30 border-b-2 border-[#D6B858] font-bold shadow-xs"
                    : "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <Layout className="w-4 h-4 text-[#D6B858]" />
                <span>{t.navIframe}</span>
              </button>

              <button
                onClick={() => onViewChange("cms_editor")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  currentView === "cms_editor"
                    ? "text-[#725c00] bg-[#D6B858]/30 border-b-2 border-[#D6B858] font-bold shadow-xs"
                    : "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <Edit3 className="w-4 h-4 text-[#D6B858]" />
                <span>{t.navCMSEditor}</span>
              </button>
            </>
          )}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onViewChange("courses")}
            className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black text-xs md:text-sm px-4 py-2 rounded-md shadow-xs transition-all active:scale-95 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t.btnExploreCourses}</span>
          </button>
        </div>
      </div>

      {/* Admin Authentication Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D6B858] max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#1A1A19]">
                <div className="w-8 h-8 rounded-full bg-[#1A1A19] text-[#D6B858] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{t.adminLoginTitle}</h3>
                  <p className="text-xs text-gray-500">{t.adminLoginDesc}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t.adminPasswordLabel}
                </label>
                <input
                  type="password"
                  placeholder="Ej. renewu2026admin"
                  value={adminPasswordInput}
                  onChange={(e) => {
                    setAdminPasswordInput(e.target.value);
                    setAdminError("");
                  }}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
                  autoFocus
                />
                {adminError && <p className="text-xs text-red-600 mt-1 font-semibold">{adminError}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-extrabold py-2.5 rounded-lg text-xs shadow-sm"
                >
                  {t.adminLoginBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};


