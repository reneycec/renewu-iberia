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
import { GraduationCap, ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Mail, Phone, MapPin, Clock, Globe, Share2, Facebook, Instagram, Youtube, Twitter, Linkedin } from "lucide-react";


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
      <footer className="bg-[#1A1A19] text-gray-400 py-12 px-4 md:px-10 border-t-4 border-[#D6B858] mt-16 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Social Media */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/renewu-icon.png" alt="RenewU Icon" className="w-8 h-8 rounded object-contain border border-[#D6B858]/40" />
              <span className="text-white font-extrabold text-2xl tracking-tight">Renew<span className="text-[#D6B858]">U</span></span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Renew University - Programa de Certificado en Teología. Formación teológica accesible, rigurosa y conectada con Moodle LMS (campus.renewu-iberia.com).
            </p>

            {/* Social Media Links (RRSS) */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-[#D6B858] uppercase tracking-wider block">
                {t.footerSocialTitle || "Síguenos en Redes Sociales"}
              </span>
              <div className="flex items-center gap-2.5 text-gray-300">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-[#D6B858] hover:text-[#1A1A19] flex items-center justify-center transition-all shadow-xs" title="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-[#D6B858] hover:text-[#1A1A19] flex items-center justify-center transition-all shadow-xs" title="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-[#D6B858] hover:text-[#1A1A19] flex items-center justify-center transition-all shadow-xs" title="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-[#D6B858] hover:text-[#1A1A19] flex items-center justify-center transition-all shadow-xs" title="Twitter / X">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-[#D6B858] hover:text-[#1A1A19] flex items-center justify-center transition-all shadow-xs" title="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Direct Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D6B858]" />
              <span>{t.footerContactTitle || "Contacto & Soporte Académico"}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D6B858] shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Correo Electrónico:</span>
                  <a href={`mailto:${t.footerEmail || 'info@renewu-iberia.com'}`} className="hover:text-white font-medium text-[#D6B858]">
                    {t.footerEmail || "info@renewu-iberia.com"}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D6B858] shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Teléfono / WhatsApp:</span>
                  <a href={`https://wa.me/34612345678`} target="_blank" rel="noreferrer" className="hover:text-white font-medium">
                    {t.footerPhone || "+34 910 000 000 / +34 612 345 678"}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D6B858] shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Ubicación & Sede:</span>
                  <span>{t.footerAddress || "Campus Virtual & Sede Iberia, Madrid, España"}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#D6B858] shrink-0 mt-0.5" />
                <span className="text-gray-400 text-[11px]">{t.footerHours || "Atención: Lun - Vie (9:00 - 18:00 CET)"}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm mb-3 border-b border-gray-800 pb-2">Accesos Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView("courses")} className="hover:text-[#D6B858] transition-colors flex items-center gap-1">
                  <span>›</span> {t.navCourses} (12 Cursos)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("about")} className="hover:text-[#D6B858] transition-colors flex items-center gap-1">
                  <span>›</span> {t.navAbout}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("enrollment")} className="hover:text-[#D6B858] transition-colors flex items-center gap-1">
                  <span>›</span> {t.navEnrollment}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("checkout")} className="hover:text-[#D6B858] transition-colors flex items-center gap-1">
                  <span>›</span> {t.navPayment} ($59 / $709)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("ai_tutor")} className="hover:text-[#D6B858] transition-colors flex items-center gap-1">
                  <span>›</span> {t.navAITutor}
                </button>
              </li>
              {isAdminAuthenticated && (
                <li>
                  <button onClick={() => setCurrentView("cms_editor")} className="hover:text-[#D6B858] transition-colors font-bold text-[#D6B858] flex items-center gap-1">
                    <span>›</span> Editor CMS (Traducciones)
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Campus Virtual & Security */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D6B858]" />
              <span>Campus Virtual & Seguridad</span>
            </h4>
            <div className="bg-gray-900 border border-gray-800 p-3.5 rounded-lg space-y-2">
              <span className="text-white font-bold text-xs block">Moodle LMS En Vivo</span>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Campus alojado en <a href="https://campus.renewu-iberia.com" target="_blank" rel="noreferrer" className="text-[#D6B858] underline">campus.renewu-iberia.com</a>. Sincronización automática de matrículas vía API REST.
              </p>
              <div className="pt-1">
                <a
                  href="https://campus.renewu-iberia.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-bold text-[11px] px-3 py-1.5 rounded inline-block transition-all"
                >
                  Entrar al Aula Virtual
                </a>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Pagos encriptados con tecnología SSL 256-bit y pasarela Stripe.
            </p>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-gray-500 gap-4">
          <p>© 2026 Renew University (renewu-iberia.com). Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-white">Política de Privacidad</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Términos de Servicio</a>
            <span>•</span>
            <a href="https://campus.renewu-iberia.com" target="_blank" rel="noreferrer" className="hover:text-[#D6B858]">Soporte Moodle</a>
          </div>
        </div>
      </footer>
    </div>
  );
}



