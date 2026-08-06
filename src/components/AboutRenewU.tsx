import React from "react";
import { ViewMode } from "../types";
import { Dictionary } from "../data/translations";
import { GraduationCap, ShieldCheck, Heart, Award, Users, BookOpen, CheckCircle2, Globe, HelpCircle, ArrowRight, ExternalLink } from "lucide-react";

interface AboutRenewUProps {
  onViewChange: (view: ViewMode) => void;
  t: Dictionary;
}

export const AboutRenewU: React.FC<AboutRenewUProps> = ({ onViewChange, t }) => {

  const leadershipTeam = [
    {
      name: "Dr. Bobby Harrington",
      role: "Lead Executive Director & Academic Council",
      bio: "Fundador de Discipleship.org y Renew.org. Doctor en Ministerio por Princeton Theological Seminary. Apasionado por la formación teológica centrada en la Gran Comisión.",
      imgBg: "bg-amber-900 text-[#D6B858]"
    },
    {
      name: "Dr. David Young",
      role: "Dean of Theological Studies",
      bio: "Doctor en Teología por Vanderbilt University. Pastor principal en North Boulevard Church y autor de múltiples obras teológicas sobre la vida del discipulado.",
      imgBg: "bg-stone-900 text-amber-200"
    },
    {
      name: "Dr. Chad Ragsdale",
      role: "Vice President of Academic Affairs",
      bio: "Decano Académico en Ozark Christian College. Especialista en Apologética y Hermenéutica Cristiana con maestría en Lincoln Christian University.",
      imgBg: "bg-zinc-800 text-amber-100"
    },
    {
      name: "Prof. Antonio García",
      role: "Director de Iniciativas Hispanas",
      bio: "Especialista en Educación Teológica para América Latina y la comunidad hispana en EE.UU. Coordinador del programa en español en Moodle LMS.",
      imgBg: "bg-[#1A1A19] text-[#D6B858]"
    }
  ];

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
              className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black text-xs md:text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Ver Catálogo de 12 Cursos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewChange("enrollment")}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
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

      {/* Leadership & Faculty Council */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#725c00] font-bold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Cuerpo Docente & Consejo Académico</span>
          </div>
          <h2 className="text-2xl font-black text-[#1A1A19]">Liderazgo Académico de Renew University</h2>
          <p className="text-xs text-gray-600 mt-1">
            Nuestros catedráticos combinan la más alta preparación universitaria académica con experiencia pastoral activa en la iglesia local.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leadershipTeam.map((member, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-black text-lg ${member.imgBg}`}>
                {member.name.split(" ")[1]?.[0] || "R"}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-[#1A1A19]">{member.name}</h4>
                <p className="text-xs text-[#725c00] font-semibold">{member.role}</p>
                <p className="text-xs text-gray-600 leading-relaxed pt-1">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#725c00] font-bold text-xs uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Preguntas Frecuentes</span>
          </div>
          <h2 className="text-2xl font-black text-[#1A1A19]">Respuestas Rápidas sobre el Programa</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqList.map((faq, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-2">
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
      <div className="bg-[#1A1A19] text-white p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-[#D6B858]">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-[#D6B858]" />
          <div className="text-xs">
            <span className="font-bold text-white block">Sitio Oficial Renew.org Network</span>
            <span className="text-gray-400">https://renewuniversity.org</span>
          </div>
        </div>

        <a
          href="https://renewuniversity.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#D6B858] hover:underline font-bold flex items-center gap-1 bg-white/5 px-3 py-2 rounded-lg border border-[#D6B858]/30"
        >
          <span>Visitar Portal Oficial Externo</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
