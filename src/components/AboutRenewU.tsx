import React, { useState, useEffect } from "react";
import { ViewMode, FacultyMember } from "../types";
import { Dictionary } from "../data/translations";
import { getStoredFaculty } from "../data/facultyData";
import { GraduationCap, ShieldCheck, Heart, Users, BookOpen, CheckCircle2, Globe, HelpCircle, ArrowRight, ExternalLink, Award, Sparkles, BookMarked, Compass, User, Landmark, AlertTriangle } from "lucide-react";

interface AboutRenewUProps {
  onViewChange: (view: ViewMode) => void;
  t?: Dictionary;
}

export const AboutRenewU: React.FC<AboutRenewUProps> = ({ onViewChange }) => {
  const [selectedFacultyLang, setSelectedFacultyLang] = useState<"es" | "en">("es");
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const local = getStoredFaculty();
    setFacultyMembers(local);

    fetch("/api/faculty")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.faculty) && data.faculty.length > 0) {
          setFacultyMembers(data.faculty);
        }
      })
      .catch(() => {});
  }, []);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const getInitials = (name: string) => {
    return name
      .replace(/^(dr\.|prof\.|mstro\.)\s*/i, "")
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const faqList = [
    {
      q: "¿Qué tipo de certificación otorga Renew University?",
      a: "Otorgamos el 'Certificado en Teología y Discipulado Cristiano', respaldado por Renew.org e instituciones socias. Es un diploma no acreditado académicamente por agencias estatales para mantener la matrícula accesible ($59 por curso), pero con estándares de rigor universitarios."
    },
    {
      q: "¿Cómo se accede a las clases una vez pagada la matrícula?",
      a: "El Portal de Registro genera automáticamente tus credenciales y te inscribe vía la REST API de Moodle. Recibirás un correo inmediato con tu usuario/contraseña y podrás ingresar a campus.renewuniversity.org o directamente desde esta plataforma."
    },
    {
      q: "¿Puedo tomar los cursos a mi propio ritmo?",
      a: "Sí. Aunque cada materia tiene fechas de inicio y cierre de cohorte para promover la interacción comunitaria y tareas con profesores, todo el material audiovisual y lecturas están disponibles 24/7 en Moodle."
    },
    {
      q: "¿Existen descuentos para grupos de iglesias o líderes?",
      a: "Sí, la opción de suscripción al Programa Completo ($709 USD) ofrece un ahorro del 20%. Además, las iglesias aliadas pueden solicitar códigos de beca o convenios de grupo enviándonos un mensaje."
    }
  ];

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-8 px-4 md:px-10 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="bg-[#1A1A19] text-white rounded-2xl p-8 md:p-12 shadow-xl border-b-4 border-[#D6B858] relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D6B858]/20 border border-[#D6B858]/40 text-[#D6B858] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Acerca de Renew University (renewuniversity.org)</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Formando Líderes y Discípulos según el <span className="text-[#D6B858]">Diseño Bíblico</span>
          </h1>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Renew University es la iniciativa educativa oficial de Renew.org Network (organización 501(c)(3) sin fines de lucro) dedicada a brindar formación teológica rigurosa, accesible e integradamente conectada con Moodle LMS.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onViewChange("courses")}
              className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black text-xs md:text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Ver Catálogo de 12 Cursos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewChange("enrollment")}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl transition-all border border-white/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Solicitar Inscripción</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mission & Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D6B858]/20 text-[#725c00] flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-[#1A1A19]">Teología Bíblica Rigurosa</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Enseñanza fuertemente anclada en la inerrancia e inspiración de las Escrituras, explorando el Antiguo y Nuevo Testamento con hermenéutica contextual.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D6B858]/20 text-[#725c00] flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-[#1A1A19]">Discipulado Transformativo</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            No buscamos meramente acumulación de conocimiento intelectual, sino la transformación del carácter y la multiplicación de discípulos en la iglesia local.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D6B858]/20 text-[#725c00] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-[#1A1A19]">Accesibilidad Económica</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Eliminamos las barreras financieras tradicionales de los seminarios. Ofrecemos formación universitaria a un costo de solo $59 USD por materia.
          </p>
        </div>
      </div>

      {/* Institutional Expansion: Leadership Support, Ministry Challenges & Accredited Partners (app.renewuniversity.org) */}
      <section className="space-y-10">
        {/* Header Banner */}
        <div className="bg-[#1A1A19] text-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#D6B858]/30 relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#D6B858]/20 border border-[#D6B858]/40 text-[#D6B858] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma & Ecosistema de Liderazgo (app.renewuniversity.org)</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">
              Apoyo Estructurado para el <span className="text-[#D6B858]">Liderazgo Ministerial</span>
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              Renew University no es solo un portal de cursos: es un ecosistema de capacitación integral diseñado para superar las presiones reales del ministerio cristiano y fortalecer a pastores, plantadores de iglesias y líderes con convenios de transferencia universitaria formal.
            </p>
          </div>
        </div>

        {/* 1. Desafíos Reales vs Apoyo Estructurado de RenewU */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card: Desafíos del Liderazgo Actual */}
          <div className="bg-white border-2 border-red-100 rounded-3xl p-6 md:p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-3 border-b border-red-50 pb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1A1A19]">Desafíos del Liderazgo Ministerial</h3>
                <p className="text-xs text-gray-500">Realidades críticas que enfrentan los líderes y pastores en el ministerio actual</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs text-gray-700">
              <li className="flex items-start gap-3 bg-red-50/50 p-3.5 rounded-xl border border-red-100">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                <div>
                  <strong className="text-gray-900 block font-bold mb-0.5">Aislamiento Pastoral y Soledad:</strong>
                  La mayoría de los líderes reportan carecer de un mentor de confianza o un grupo fraterno donde compartir sus cargas espirituales y familiares sin temor a ser juzgados.
                </div>
              </li>
              <li className="flex items-start gap-3 bg-red-50/50 p-3.5 rounded-xl border border-red-100">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                <div>
                  <strong className="text-gray-900 block font-bold mb-0.5">Sobrecarga Administrativa y Operativa:</strong>
                  Las tareas de gestión logística y resolución continua de conflictos absorben el tiempo que debería dedicarse a la oración, el estudio bíblico y el discipulado.
                </div>
              </li>
              <li className="flex items-start gap-3 bg-red-50/50 p-3.5 rounded-xl border border-red-100">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                <div>
                  <strong className="text-gray-900 block font-bold mb-0.5">Falta de Formación Continua Estructurada:</strong>
                  Los seminarios tradicionales suelen ser sumamente costosos, exigen traslados geográficos o enseñan una teología alejada de los desafíos reales de la iglesia local.
                </div>
              </li>
              <li className="flex items-start gap-3 bg-red-50/50 p-3.5 rounded-xl border border-red-100">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                <div>
                  <strong className="text-gray-900 block font-bold mb-0.5">Agotamiento y Burnout Pastoral:</strong>
                  La fatiga emocional sin hábitos de renovación espiritual genera deserciones prematuras y heridas profundas en las familias de los ministros.
                </div>
              </li>
            </ul>
          </div>

          {/* Card: Solución y Apoyo Estructurado de RenewU */}
          <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 md:p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-3 border-b border-emerald-50 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1A1A19]">La Respuesta de Renew University</h3>
                <p className="text-xs text-gray-500">Un modelo sostenible, bíblico y de mentoría comunitaria activa</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs text-gray-700">
              <li className="flex items-start gap-3 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <div>
                  <strong className="text-gray-900 block font-bold mb-0.5">Comunidad y Mentoría Fraternal:</strong>
                  Acompañamiento continuo con instructores que sirven activamente en el ministerio y cohortes de estudio que crean redes de apoyo espiritual de por vida.
                </div>
              </li>
              <li className="flex items-start gap-3 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <div>
                  <strong className="text-gray-900 block font-bold mb-0.5">Flexibilidad Total con Rigor Teológico:</strong>
                  Cursos modulares a tu propio ritmo con lecturas maestras, tareas de aplicación ministerial inmediata y acceso 24/7 en la plataforma Moodle.
                </div>
              </li>
              <li className="flex items-start gap-3 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <div>
                  <strong className="text-gray-900 block font-bold mb-0.5">Enfoque Central: Hacer Discípulos que Hagan Discípulos:</strong>
                  Cada contenido teológico está directamente orientado a capacitarte para reproducir líderes comprometidos en tu congregación local.
                </div>
              </li>
              <li className="flex items-start gap-3 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <div>
                  <strong className="text-gray-900 block font-bold mb-0.5">Accesibilidad Económica Radical:</strong>
                  Solo $59 USD por materia (o $709 programa completo), garantizando formación universitaria sin deudas para cualquier líder en el mundo de habla hispana.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. Program Partners - Convalidación y Acreditación de Créditos Universitarios */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 space-y-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D6B858]/20 text-[#725c00] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <Landmark className="w-4 h-4 text-[#D6B858]" />
                <span>Program Partners (app.renewuniversity.org/partners)</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-[#1A1A19] tracking-tight">
                Instituciones Socias y Transferencia de Créditos Académicos
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1 max-w-3xl">
                Los cursos completados en Renew University cuentan con convenios de articulación académica y reconocimiento de créditos con universidades e instituciones teológicas en Estados Unidos y Canadá:
              </p>
            </div>
            <a
              href="https://app.renewuniversity.org"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1A1A19] text-[#D6B858] hover:bg-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-[#D6B858]/40 flex items-center gap-2 shrink-0 transition-all shadow-xs"
            >
              <span>Ver en app.renewuniversity.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Partner 1: Central Christian College of the Bible */}
            <div className="bg-gray-50 hover:bg-white border-2 border-gray-200 hover:border-[#D6B858] rounded-2xl p-6 space-y-4 transition-all duration-300 shadow-xs flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#D6B858]/20 group-hover:bg-[#D6B858] group-hover:text-[#1A1A19] text-[#725c00] flex items-center justify-center font-black text-xl transition-all">
                  CCCB
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#725c00] bg-[#D6B858]/15 px-2 py-0.5 rounded">
                    Moberly, Missouri (EE. UU.)
                  </span>
                  <h4 className="text-base font-black text-[#1A1A19] mt-1.5">
                    Central Christian College of the Bible
                  </h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Ofrece horas de crédito universitario transferibles (Transferable College Credit Hours) a estudiantes que completan los cursos del Certificado en Renew University, permitiendo avanzar hacia títulos de Licenciatura en Ministerio Cristiano o Teología Bíblica.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 text-[11px] font-bold text-gray-500 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D6B858]" />
                <span>Créditos Universitarios Transferibles</span>
              </div>
            </div>

            {/* Partner 2: Maritime Christian College */}
            <div className="bg-gray-50 hover:bg-white border-2 border-gray-200 hover:border-[#D6B858] rounded-2xl p-6 space-y-4 transition-all duration-300 shadow-xs flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#D6B858]/20 group-hover:bg-[#D6B858] group-hover:text-[#1A1A19] text-[#725c00] flex items-center justify-center font-black text-xl transition-all">
                  MCC
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#725c00] bg-[#D6B858]/15 px-2 py-0.5 rounded">
                    Charlottetown, PEI (Canadá)
                  </span>
                  <h4 className="text-base font-black text-[#1A1A19] mt-1.5">
                    Maritime Christian College
                  </h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Convalida hasta <strong>8 horas de crédito universitario de grado</strong> (8 Undergraduate Credit Hours) para graduados de Renew University que continúen estudios teológicos en los programas académicos de grado de Maritime Christian College.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 text-[11px] font-bold text-gray-500 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D6B858]" />
                <span>8 Horas de Crédito Pregrado</span>
              </div>
            </div>

            {/* Partner 3: York University */}
            <div className="bg-gray-50 hover:bg-white border-2 border-gray-200 hover:border-[#D6B858] rounded-2xl p-6 space-y-4 transition-all duration-300 shadow-xs flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#D6B858]/20 group-hover:bg-[#D6B858] group-hover:text-[#1A1A19] text-[#725c00] flex items-center justify-center font-black text-xl transition-all">
                  YU
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#725c00] bg-[#D6B858]/15 px-2 py-0.5 rounded">
                    York, Nebraska (EE. UU.)
                  </span>
                  <h4 className="text-base font-black text-[#1A1A19] mt-1.5">
                    York University
                  </h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Otorga reconocimiento para horas de crédito tanto de <strong>grado como de posgrado</strong> (Undergraduate & Graduate Credit Hours) con base en el rigor del currículo de Renew University, abriendo puertas a programas de Maestría en Estudios Bíblicos.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 text-[11px] font-bold text-gray-500 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D6B858]" />
                <span>Créditos de Grado & Posgrado</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Church Services & Local Congregations */}
        <div className="bg-gradient-to-br from-[#1A1A19] to-gray-900 text-white rounded-3xl p-8 md:p-10 border-l-4 border-[#D6B858] shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="bg-[#D6B858] text-[#1A1A19] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full inline-block">
                Servicios para Iglesias Locales (Church Services)
              </span>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                Equipando a Toda la Congregación
              </h3>
              <p className="text-gray-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                Renew University colabora directamente con pastores principales y consejos de liderazgo para implementar planes de formación bíblica y discipulado en la congregación local:
              </p>
            </div>
            <button
              onClick={() => onViewChange("enrollment")}
              className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md shrink-0 cursor-pointer self-start md:self-center"
            >
              Consultar Convenios para Iglesias
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-[#D6B858] font-black text-lg block">01</span>
              <h5 className="font-bold text-sm text-white">Talleres Ministeriales</h5>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Capacitación práctica para equipos de liderazgo, grupos pequeños y plantadores de iglesias en la península ibérica y Latinoamérica.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-[#D6B858] font-black text-lg block">02</span>
              <h5 className="font-bold text-sm text-white">Currículo Congregacional</h5>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Acceso a libros de lectura estructurados, preguntas de discusión y guías de estudio para la formación de discípulos en grupos pequeños.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-[#D6B858] font-black text-lg block">03</span>
              <h5 className="font-bold text-sm text-white">Mentoría en Crisis</h5>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Acompañamiento especializado basado en el curso 1003 para prevenir el agotamiento pastoral y gestionar situaciones críticas en el ministerio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Faculty Council - Premium Canvas Showcase */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 space-y-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D6B858]/20 text-[#725c00] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-[#D6B858]" />
              <span>Cuerpo Docente Oficial & Consejo Académico (renewuniversity.org/about/faculty)</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A19] tracking-tight">
              Profesorado y Catedráticos de Renew University
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-3xl">
              Conoce a los 12 reconocidos profesores y teólogos que dirigen el programa académico de RenewU con sus retratos, especialidades y biografías completas.
            </p>
          </div>

          {/* Language Switcher for Bios */}
          <div className="flex items-center gap-2 shrink-0 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
            <span className="text-xs font-bold text-gray-500 px-2 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#D6B858]" /> Idioma Bio:
            </span>
            <button
              onClick={() => setSelectedFacultyLang("es")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFacultyLang === "es"
                  ? "bg-[#1A1A19] text-[#D6B858] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🇪🇸 Español
            </button>
            <button
              onClick={() => setSelectedFacultyLang("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFacultyLang === "en"
                  ? "bg-[#1A1A19] text-[#D6B858] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🇺🇸 English Original
            </button>
          </div>
        </div>

        {/* Faculty Grid - Premium Styled Cards Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facultyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white border-2 border-gray-100 hover:border-[#D6B858] rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo Canvas Frame with Gold Accent Overlay */}
                <div className="relative h-72 md:h-80 w-full overflow-hidden bg-gradient-to-t from-[#1A1A19] via-[#1A1A19]/30 to-transparent flex items-center justify-center">
                  {!imageErrors[member.id] ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      onError={() => handleImageError(member.id)}
                      className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1A1A19] text-[#D6B858] flex flex-col items-center justify-center space-y-2 p-6">
                      <div className="w-24 h-24 rounded-full bg-[#D6B858]/20 border-2 border-[#D6B858] flex items-center justify-center text-3xl font-black">
                        {getInitials(member.name)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#D6B858]">
                        <User className="w-4 h-4" />
                        <span>Profesor Renew University</span>
                      </div>
                    </div>
                  )}

                  {/* Floating Canvas Badges & Header Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A19] via-[#1A1A19]/20 to-transparent flex flex-col justify-end p-6">
                    <span className="bg-[#D6B858] text-[#1A1A19] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full self-start mb-2 shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>{member.specialty}</span>
                    </span>

                    <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                      {member.name}
                    </h3>

                    <p className="text-xs font-bold text-[#D6B858] mt-0.5 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span>{member.role}</span>
                    </p>
                  </div>
                </div>

                {/* Detailed Bio Section */}
                <div className="p-6 md:p-8 space-y-4 bg-white">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <BookMarked className="w-4 h-4 text-[#D6B858]" />
                    <span className="text-xs font-extrabold text-[#725c00] uppercase tracking-wider">
                      Biografía Académica & Trayectoria
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-normal">
                    {selectedFacultyLang === "en" ? member.bioEn : member.bioEs}
                  </p>
                </div>
              </div>

              {/* Card Footer Badge */}
              <div className="px-6 pb-6 pt-2 bg-white flex items-center justify-between border-t border-gray-50 text-[11px] text-gray-500">
                <span className="flex items-center gap-1 font-medium">
                  <Compass className="w-3.5 h-3.5 text-[#D6B858]" /> Renew University Faculty
                </span>
                {member.externalLink ? (
                  <a
                    href={member.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#725c00] hover:text-[#1A1A19] flex items-center gap-1 hover:underline"
                  >
                    <span>Perfil Oficial</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="font-bold text-[#725c00]">renewuniversity.org</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#725c00] font-bold text-xs uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4 text-[#D6B858]" />
            <span>Preguntas Frecuentes</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#1A1A19]">Respuestas Rápidas sobre el Programa</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqList.map((faq, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-[#1A1A19] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D6B858] shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Links Footer Bar */}
      <div className="bg-[#1A1A19] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-[#D6B858]">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-[#D6B858]" />
          <div className="text-xs">
            <span className="font-bold text-white block">Sitio Oficial Renew.org Network</span>
            <span className="text-gray-400">https://renewuniversity.org</span>
          </div>
        </div>

        <a
          href="https://renewuniversity.org/about/faculty"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#D6B858] hover:underline font-bold flex items-center gap-1 bg-white/5 px-4 py-2.5 rounded-xl border border-[#D6B858]/30 transition-all hover:bg-white/10"
        >
          <span>Visitar Facultad en Portal Oficial Externo</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
