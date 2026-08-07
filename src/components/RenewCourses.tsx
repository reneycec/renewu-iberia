import React, { useState, useEffect } from "react";
import { Course, ViewMode } from "../types";
import { Dictionary } from "../data/translations";
import { getStoredCourses, updateCoursePrice, updateAllCoursePrices, resetStoredCourses } from "../data/coursesData";
import { BookOpen, Calendar, Clock, Award, CheckCircle2, ChevronRight, UserCheck, Shield, Sparkles, Filter, Info, ArrowRight, DollarSign, Database, X, Settings, Edit3, RotateCcw, Check } from "lucide-react";

interface RenewCoursesProps {
  onSelectCourseForEnrollment?: (course: Course) => void;
  onViewChange: (view: ViewMode) => void;
  t: Dictionary;
}

export const RenewCourses: React.FC<RenewCoursesProps> = ({
  onSelectCourseForEnrollment,
  onViewChange,
  t,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);

  // Course Price Management State
  const [isPriceEditorOpen, setIsPriceEditorOpen] = useState(false);
  const [editingPriceMap, setEditingPriceMap] = useState<Record<string, number>>({});
  const [bulkPriceValue, setBulkPriceValue] = useState<string>("59");
  const [priceSaveSuccess, setPriceSaveSuccess] = useState(false);

  useEffect(() => {
    const stored = getStoredCourses();
    setCourses(stored);
    const initialMap: Record<string, number> = {};
    stored.forEach((c) => {
      initialMap[c.id] = c.priceSingle;
    });
    setEditingPriceMap(initialMap);
  }, []);

  const categories = [
    { label: t.categoryAll, value: "Todos" },
    { label: t.categoryBiblical, value: "Estudios Bíblicos" },
    { label: t.categorySystematic, value: "Teología Sistemática" },
    { label: t.categoryPractical, value: "Ministerio Práctico" },
    { label: t.categoryHistory, value: "Historia y Apologética" },
  ];


  const filteredCourses = selectedCategory === "Todos"
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  const handleEnrollClick = (course: Course) => {
    if (onSelectCourseForEnrollment) {
      onSelectCourseForEnrollment(course);
    }
    onViewChange("enrollment");
  };

  const handleSavePriceMap = () => {
    let updated = [...courses];
    Object.entries(editingPriceMap).forEach(([cId, price]) => {
      updated = updateCoursePrice(cId, price);
    });
    setCourses(updated);
    setPriceSaveSuccess(true);
    setTimeout(() => setPriceSaveSuccess(false), 3000);
  };

  const handleApplyBulkPrice = () => {
    const num = parseFloat(bulkPriceValue);
    if (!isNaN(num) && num >= 0) {
      const updated = updateAllCoursePrices(num);
      setCourses(updated);
      const newMap: Record<string, number> = {};
      updated.forEach((c) => {
        newMap[c.id] = c.priceSingle;
      });
      setEditingPriceMap(newMap);
      setPriceSaveSuccess(true);
      setTimeout(() => setPriceSaveSuccess(false), 3000);
    }
  };

  const handleResetDefaultPrices = () => {
    if (window.confirm("¿Deseas restaurar el precio predeterminado de $59 USD para todos los cursos?")) {
      const restored = resetStoredCourses();
      setCourses(restored);
      const newMap: Record<string, number> = {};
      restored.forEach((c) => {
        newMap[c.id] = c.priceSingle;
      });
      setEditingPriceMap(newMap);
      setPriceSaveSuccess(true);
      setTimeout(() => setPriceSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-8 px-4 md:px-10 max-w-7xl mx-auto space-y-10">
      {/* Top Banner Header */}
      <div className="bg-[#1A1A19] text-white rounded-2xl p-8 md:p-12 shadow-xl border-b-4 border-[#D6B858] relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
          <BookOpen className="w-96 h-96 text-[#D6B858]" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#D6B858]/20 border border-[#D6B858]/40 text-[#D6B858] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catálogo Oficial de Cursos — Renew University</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Programa de <span className="text-[#D6B858]">Certificado en Teología</span>
          </h1>
          
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            12 cursos diseñados con rigurosidad académica y flexibilidad pastoral para líderes, pastores y discípulos. Sincronización inmediata con nuestro Campus Moodle LMS al completar la matrícula.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs md:text-sm text-gray-300 font-medium">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D6B858]" />
              <span>36 Créditos Académicos Totales</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D6B858]" />
              <span>100% Online e Interactivo</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#D6B858]" />
              <span>Precio Dinámico por curso / $709 Programa Completo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Price Management Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 text-[#725c00] font-bold text-sm">
          <Filter className="w-4 h-4" />
          <span>Filtrar Cursos por Categoría:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.value
                  ? "bg-[#1A1A19] text-[#D6B858] shadow-sm font-bold"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}

          <button
            onClick={() => setIsPriceEditorOpen(true)}
            className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-extrabold text-xs px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto md:ml-2"
            title="Ajustar tarifas y precios individuales o masivos"
          >
            <Settings className="w-4 h-4" />
            <span>⚙️ Cambiar Precios de Cursos</span>
          </button>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Card Header Banner */}
              <div className={`bg-gradient-to-r ${course.bannerBg || 'from-[#1A1A19] to-amber-950'} p-5 text-white relative`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-[#D6B858] text-[#1A1A19] font-black text-xs px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {course.code}
                  </span>
                  <span className="text-[11px] bg-black/40 text-gray-200 px-2.5 py-0.5 rounded-full font-mono border border-white/10">
                    Moodle ID: #{course.moodleCourseId}
                  </span>
                </div>
                <h3 className="font-bold text-lg md:text-xl text-white leading-snug group-hover:text-[#D6B858] transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-amber-200/80 font-medium mt-1">
                  {course.category} • {course.credits} Créditos
                </p>
              </div>

              {/* Body Details */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {course.description}
                </p>

                {/* Key Dates Box */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#D6B858]" />
                      Inicio de Clases:
                    </span>
                    <span className="font-bold text-[#1A1A19]">{course.startDate}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-700">
                    <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#D6B858]" />
                      Cierre Inscripción:
                    </span>
                    <span className="font-bold text-red-700">{course.registrationDeadline}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-700 pt-1 border-t border-gray-200">
                    <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-[#D6B858]" />
                      Catedrático:
                    </span>
                    <span className="font-semibold text-gray-800">{course.instructor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Price & Actions */}
            <div className="p-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">Inversión</span>
                <span className="text-lg font-black text-[#1A1A19]">${course.priceSingle} <span className="text-xs text-gray-500 font-normal">USD</span></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCourseForModal(course)}
                  className="px-3 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
                >
                  Syllabus
                </button>
                <button
                  onClick={() => handleEnrollClick(course)}
                  className="px-3.5 py-2 text-xs font-extrabold text-[#1A1A19] bg-[#D6B858] hover:bg-[#c3a447] rounded-lg shadow-xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span>Inscribirme</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Program Summary CTA */}
      <div className="bg-[#1A1A19] text-white rounded-2xl p-8 border-l-8 border-[#D6B858] flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2">
          <span className="text-xs text-[#D6B858] font-bold uppercase tracking-wider">Ahorro del 20% en Matrícula Global</span>
          <h3 className="text-xl md:text-2xl font-extrabold">¿Deseas completar el Programa de Certificado Completo?</h3>
          <p className="text-xs md:text-sm text-gray-300 max-w-2xl">
            Inscríbete en el paquete de 12 cursos por solo $709 USD (Ahorra $128 USD respecto al pago por materias individuales) e ingresa al Campus Moodle inmediatamente.
          </p>
        </div>

        <button
          onClick={() => onViewChange("checkout")}
          className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black text-sm px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
        >
          <span>Pagar Programa Completo ($709)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Syllabus Modal */}
      {selectedCourseForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 border border-gray-200 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <span className="bg-[#D6B858] text-[#1A1A19] font-bold text-xs px-2.5 py-0.5 rounded uppercase mr-2">
                  {selectedCourseForModal.code}
                </span>
                <span className="text-xs text-gray-500 font-medium">{selectedCourseForModal.category}</span>
                <h3 className="text-2xl font-black text-[#1A1A19] mt-1">{selectedCourseForModal.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCourseForModal(null)}
                className="text-gray-400 hover:text-gray-800 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-[#725c00] uppercase tracking-wider mb-1">Descripción General</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedCourseForModal.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#725c00] uppercase tracking-wider mb-2">Syllabus / Unidades de Aprendizaje</h4>
                <ul className="space-y-2">
                  {selectedCourseForModal.detailedSyllabus.map((unit, idx) => (
                    <li key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs md:text-sm text-gray-800 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B858] shrink-0 mt-0.5" />
                      <span>{unit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-xs">
                <div>
                  <span className="text-gray-500 block font-medium">Inicio de Clases:</span>
                  <span className="font-bold text-gray-900">{selectedCourseForModal.startDate}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Fecha Límite Inscripción:</span>
                  <span className="font-bold text-red-700">{selectedCourseForModal.registrationDeadline}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Catedrático:</span>
                  <span className="font-bold text-gray-900">{selectedCourseForModal.instructor}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Moodle Course Shortname:</span>
                  <span className="font-mono font-bold text-gray-900">{selectedCourseForModal.moodleShortname}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedCourseForModal(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const courseToEnroll = selectedCourseForModal;
                  setSelectedCourseForModal(null);
                  handleEnrollClick(courseToEnroll);
                }}
                className="px-5 py-2 text-xs font-black text-[#1A1A19] bg-[#D6B858] hover:bg-[#c3a447] rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceder a Inscripción (${selectedCourseForModal.priceSingle})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Price Management Modal */}
      {isPriceEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 border border-[#D6B858] shadow-2xl animate-scale-up">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#D6B858]/20 text-[#725c00] text-xs font-bold px-2.5 py-0.5 rounded-full mb-1">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Gestor Administrativo de Precios</span>
                </div>
                <h3 className="text-2xl font-black text-[#1A1A19]">Cambiar Precio de Cursos (USD)</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Ajusta la tarifa individual de cada materia o aplica un costo masivo para todo el catálogo de 12 cursos.
                </p>
              </div>
              <button
                onClick={() => setIsPriceEditorOpen(false)}
                className="text-gray-400 hover:text-gray-800 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Bulk Price Tool */}
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-3">
              <span className="text-xs font-bold text-[#725c00] uppercase tracking-wider block">
                ⚡ Cambio de Precio Masivo (Todos los Cursos)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={bulkPriceValue}
                    onChange={(e) => setBulkPriceValue(e.target.value)}
                    className="w-32 text-xs border border-gray-300 rounded-lg pl-7 pr-3 py-2 focus:border-[#D6B858] outline-none font-bold text-gray-900"
                  />
                </div>
                <button
                  onClick={handleApplyBulkPrice}
                  className="bg-[#1A1A19] hover:bg-black text-[#D6B858] font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer"
                >
                  Aplicar a los 12 Cursos
                </button>
                <button
                  onClick={handleResetDefaultPrices}
                  className="text-xs text-gray-600 hover:text-red-700 underline font-semibold flex items-center gap-1 ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar $59 Predeterminado
                </button>
              </div>
            </div>

            {/* Individual Course Price Table */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                📋 Tarifas Individuales por Materia
              </span>
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 max-h-72 overflow-y-auto">
                {courses.map((course) => (
                  <div key={course.id} className="p-3 grid grid-cols-12 items-center gap-3 hover:bg-gray-50 text-xs">
                    <div className="col-span-3 font-mono font-bold text-[#725c00]">
                      <span className="bg-[#D6B858]/20 px-2 py-0.5 rounded">{course.code}</span>
                    </div>
                    <div className="col-span-6 font-semibold text-gray-800 truncate" title={course.title}>
                      {course.title}
                    </div>
                    <div className="col-span-3 flex items-center gap-1 justify-end">
                      <span className="text-gray-500 font-bold">$</span>
                      <input
                        type="number"
                        min="0"
                        value={editingPriceMap[course.id] ?? course.priceSingle}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setEditingPriceMap((prev) => ({ ...prev, [course.id]: val }));
                        }}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-xs font-bold text-gray-900 focus:border-[#D6B858] outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                {priceSaveSuccess && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-600" />
                    ¡Precios actualizados y guardados correctamente!
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsPriceEditorOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSavePriceMap}
                  className="px-5 py-2 text-xs font-black text-[#1A1A19] bg-[#D6B858] hover:bg-[#c3a447] rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Tarifas Actualizadas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
