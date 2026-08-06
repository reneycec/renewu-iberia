import React, { useState } from "react";
import { LanguageCode } from "../types";
import { AVAILABLE_LANGUAGES, Dictionary } from "../data/translations";
import { FileText, Save, Check, Globe, RefreshCw, Sparkles, Layers, BookOpen, Info, CreditCard, Bot, GraduationCap } from "lucide-react";

interface TextCMSEditorProps {
  currentLanguage: LanguageCode;
  translations: Record<LanguageCode, Dictionary>;
  onUpdateTranslationKey: (lang: LanguageCode, key: keyof Dictionary, newValue: string) => void;
  onResetTranslations: () => void;
}

export const TextCMSEditor: React.FC<TextCMSEditorProps> = ({
  currentLanguage,
  translations,
  onUpdateTranslationKey,
  onResetTranslations,
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(currentLanguage);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const dict = translations[selectedLang] || translations.es;
  const keys = Object.keys(dict) as (keyof Dictionary)[];

  const categories = [
    { id: "all", label: "Todas las Claves", icon: Layers },
    { id: "nav", label: "Navegación & General", icon: Globe },
    { id: "courses", label: "Catálogo de Cursos", icon: BookOpen },
    { id: "about", label: "Acerca de Nosotros", icon: Info },
    { id: "form", label: "Formulario de Inscripción", icon: FileText },
    { id: "checkout", label: "Pasarela de Pago", icon: CreditCard },
    { id: "ai", label: "Tutor Teológico IA", icon: Bot },
    { id: "footer", label: "Pie de Página & Contacto / RRSS", icon: GraduationCap },
  ];

  const isKeyInCategory = (key: string, categoryId: string) => {
    if (categoryId === "all") return true;
    if (categoryId === "nav") return key.startsWith("nav") || key.startsWith("admin") || key.startsWith("hero");
    if (categoryId === "courses") return key.startsWith("course") || key.startsWith("category") || key.startsWith("modal") || key.startsWith("single") || key.startsWith("full");
    if (categoryId === "about") return key.startsWith("about") || key.startsWith("pillar") || key.startsWith("faq");
    if (categoryId === "form") return key.startsWith("form") || key.includes("Label") || key.startsWith("personal") || key.startsWith("church") || key.startsWith("academic");
    if (categoryId === "checkout") return key.startsWith("checkout") || key.startsWith("plan") || key.startsWith("card") || key.startsWith("pay");
    if (categoryId === "ai") return key.startsWith("ai") || key.startsWith("quick");
    if (categoryId === "footer") return key.startsWith("footer");
    return true;
  };


  const filteredKeys = keys.filter((key) => {
    const matchesCategory = isKeyInCategory(key, selectedCategory);
    const val = (dict[key] || "").toLowerCase();
    const k = key.toLowerCase();
    const query = searchFilter.toLowerCase();
    const matchesSearch = k.includes(query) || val.includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleSave = async () => {
    try {
      await fetch("/api/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ translations }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D6B858] p-6 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#D6B858]/15 text-[#725c00] text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B858]" />
            <span>Sistema CMS de Edición de Textos & Traducciones Dinámicas</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A19]">
            Editor CMS de Textos en Vivo
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Modifica cualquier texto, título, aviso o botón del sitio web en Español, Inglés y Portugués (PT y BR).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetTranslations}
            className="text-xs text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-300 px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restaurar Predeterminados</span>
          </button>

          <button
            onClick={handleSave}
            className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black text-xs md:text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-800" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? "¡Guardado en Servidor!" : "Guardar Cambios CMS"}</span>
          </button>
        </div>
      </div>

      {/* Language Selector & Search */}
      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 shrink-0">
            <Globe className="w-4 h-4 text-[#D6B858]" /> Idioma a Editar:
          </span>
          {AVAILABLE_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedLang === lang.code
                  ? "bg-[#1A1A19] text-[#D6B858] shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar por palabra clave..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-[#D6B858]/20 text-[#725c00] border-[#D6B858]"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#D6B858]" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Key-Value Editor Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 grid grid-cols-1 md:grid-cols-12 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span className="md:col-span-4 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#D6B858]" /> Clave de Sistema
          </span>
          <span className="md:col-span-8">Texto Visible en el Sitio ({selectedLang})</span>
        </div>

        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {filteredKeys.map((key) => (
            <div key={key} className="p-4 grid grid-cols-1 md:grid-cols-12 items-center gap-4 hover:bg-gray-50/80 transition-colors">
              <div className="md:col-span-4">
                <span className="font-mono text-xs font-semibold text-[#725c00] bg-[#D6B858]/10 px-2.5 py-1 rounded border border-[#D6B858]/20 inline-block">
                  {key}
                </span>
              </div>
              <div className="md:col-span-8">
                {(dict[key] || "").length > 60 ? (
                  <textarea
                    rows={2}
                    value={dict[key] || ""}
                    onChange={(e) => onUpdateTranslationKey(selectedLang, key, e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none font-sans"
                  />
                ) : (
                  <input
                    type="text"
                    value={dict[key] || ""}
                    onChange={(e) => onUpdateTranslationKey(selectedLang, key, e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none font-sans"
                  />
                )}
              </div>
            </div>
          ))}
          {filteredKeys.length === 0 && (
            <div className="p-8 text-center text-xs text-gray-500">
              No se encontraron coincidencias para la categoría seleccionada o la búsqueda "{searchFilter}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
