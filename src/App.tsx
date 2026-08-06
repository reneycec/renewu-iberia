import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { EnrollmentForm } from "./components/EnrollmentForm";
import { PaymentCheckout } from "./components/PaymentCheckout";
import { MoodleAdminDashboard } from "./components/MoodleAdminDashboard";
import { IframeEmbedPreview } from "./components/IframeEmbedPreview";
import { AITutorWidget } from "./components/AITutorWidget";
import { FacultyAdvisors } from "./components/FacultyAdvisors";
import { RenewCourses } from "./components/RenewCourses";
import { AboutRenewU } from "./components/AboutRenewU";
import { TextCMSEditor } from "./components/TextCMSEditor";
import { StudentEnrollment, ViewMode, LanguageCode } from "./types";
import { defaultTranslations, Dictionary } from "./data/translations";
import { GraduationCap, ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>("courses");
  const [currentStudent, setCurrentStudent] = useState<StudentEnrollment | null>(null);
  const [isIframeEmbedded, setIsIframeEmbedded] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Multi-language & CMS State
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("es");
  const [translations, setTranslations] = useState<Record<LanguageCode, Dictionary>>(defaultTranslations);

  // Admin Auth State (Stored in sessionStorage for persistent tab session)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("renewu_admin_auth") === "true";
  });

  useEffect(() => {
    // Check if running inside iframe or embed parameter
    if (window.self !== window.top || window.location.search.includes("embed=moodle")) {
      setIsIframeEmbedded(true);
    }

    // Fetch custom translations from server if available
    fetch("/api/translations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.translations) {
          setTranslations((prev) => ({
            ...prev,
            ...data.translations,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleAdminLogin = (passwordInput: string): boolean => {
    // Default admin password: renewu2026admin
    if (passwordInput === "renewu2026admin") {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem("renewu_admin_auth", "true");
      showToast("¡Modo Administración activado exitosamente!");
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem("renewu_admin_auth");
    showToast("Sesión de Administración cerrada.");
    if (["moodle_admin", "iframe_mode", "cms_editor"].includes(currentView)) {
      setCurrentView("courses");
    }
  };

  const handleUpdateTranslationKey = (lang: LanguageCode, key: keyof Dictionary, newValue: string) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: newValue,
      },
    }));
  };

  const handleResetTranslations = () => {
    if (window.confirm("¿Restaurar todas las traducciones a los textos predeterminados del sistema?")) {
      setTranslations(defaultTranslations);
      showToast("Textos y traducciones restaurados a los valores originales.");
    }
  };

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleEnrollmentSuccess = (student: StudentEnrollment) => {
    setCurrentStudent(student);
    showToast(`Solicitud de ${student.firstName} ${student.lastName} registrada. Procediendo al pago de matrícula.`);
    
    // Send postMessage event for parent Moodle frame if listening
    if (window.parent) {
      window.parent.postMessage({
        type: "RENEWU_ENROLLMENT_SUCCESS",
        student,
      }, "*");
    }

    setCurrentView("checkout");
  };

  const handlePaymentSuccess = (receipt: any) => {
    showToast(`Pago procesado exitosamente. Sincronizado con Moodle (Usuario: ${receipt.student.moodleUsername}).`);
    
    // Send postMessage event
    if (window.parent) {
      window.parent.postMessage({
        type: "RENEWU_PAYMENT_SUCCESS",
        receipt,
      }, "*");
    }
  };

  const t = translations[currentLanguage] || defaultTranslations.es;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A19] font-sans flex flex-col selection:bg-[#D6B858]/30 selection:text-[#725c00]">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-[#1A1A19] text-[#D6B858] border border-[#D6B858] px-5 py-3 rounded-lg shadow-2xl font-semibold text-xs flex items-center gap-3 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-[#D6B858]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main App Navigation Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        isIframeEmbedded={isIframeEmbedded}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        isAdmin={isAdminAuthenticated}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
        t={t}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full">
        {currentView === "courses" && (
          <RenewCourses onViewChange={setCurrentView} t={t} />
        )}

        {currentView === "about" && (
          <AboutRenewU onViewChange={setCurrentView} t={t} />
        )}

        {currentView === "enrollment" && (
          <EnrollmentForm onSubmitSuccess={handleEnrollmentSuccess} t={t} />
        )}

        {currentView === "checkout" && (
          <PaymentCheckout
            currentStudent={currentStudent}
            onPaymentSuccess={handlePaymentSuccess}
            t={t}
          />
        )}

        {currentView === "ai_tutor" && <AITutorWidget t={t} />}

        {/* Protected Admin Views */}
        {isAdminAuthenticated && (
          <>
            {currentView === "moodle_admin" && <MoodleAdminDashboard />}
            {currentView === "iframe_mode" && <IframeEmbedPreview />}
            {currentView === "cms_editor" && (
              <TextCMSEditor
                currentLanguage={currentLanguage}
                translations={translations}
                onUpdateTranslationKey={handleUpdateTranslationKey}
                onResetTranslations={handleResetTranslations}
              />
            )}
          </>
        )}

        {/* Global Faculty Section on Registration View */}
        {currentView === "enrollment" && <FacultyAdvisors t={t} />}
      </main>


      {/* Global Footer */}
      <footer className="bg-[#1A1A19] text-gray-400 py-10 px-4 md:px-10 border-t-4 border-[#D6B858] mt-12 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/renewu-icon.png" alt="RenewU Icon" className="w-7 h-7 rounded object-contain border border-[#D6B858]/30" />
              <span className="text-white font-extrabold text-xl">Renew<span className="text-[#D6B858]">U</span></span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Renew University - Programa de Certificado en Teología. Formación teológica accesible, rigurosa y conectada con Moodle LMS (campus.renewu-iberia.com).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Accesos Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView("courses")} className="hover:text-[#D6B858] transition-colors">
                  Catálogo de 12 Cursos
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("about")} className="hover:text-[#D6B858] transition-colors">
                  Acerca de Renew University
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("enrollment")} className="hover:text-[#D6B858] transition-colors">
                  Solicitud de Inscripción
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("checkout")} className="hover:text-[#D6B858] transition-colors">
                  Pago de Matrícula ($59 / $709)
                </button>
              </li>
              {isAdminAuthenticated && (
                <li>
                  <button onClick={() => setCurrentView("moodle_admin")} className="hover:text-[#D6B858] transition-colors font-bold text-[#D6B858]">
                    Panel de Administración Moodle
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Integración Moodle & API</h4>
            <ul className="space-y-2">
              <li className="font-mono text-[11px] text-[#D6B858]">core_user_create_users</li>
              <li className="font-mono text-[11px] text-[#D6B858]">enrol_manual_enrol_users</li>
              <li className="font-mono text-[11px] text-[#D6B858]">POST /api/moodle/sync</li>
              <li className="font-mono text-[11px] text-[#D6B858]">POST /api/llm/chat</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Seguridad y Garantía</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Pagos cifrados mediante encriptación SSL de 256 bits y pasarela multirregión Stripe. Cumplimiento con estándares académicos Moodle REST (campus.renewu-iberia.com).
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-gray-500">
          <p>© 2026 Renew University (renewu-iberia.com). Todos los derechos reservados.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
            <a href="https://campus.renewu-iberia.com" target="_blank" rel="noreferrer" className="hover:text-[#D6B858]">Campus Moodle Virtual</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


