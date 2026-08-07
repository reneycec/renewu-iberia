import React from "react";
import { ViewMode } from "../types";
import { Dictionary } from "../data/translations";
import { GraduationCap, ShieldCheck, Heart, Users, BookOpen, CheckCircle2, Globe, HelpCircle, ArrowRight, ExternalLink } from "lucide-react";

interface AboutRenewUProps {
  onViewChange: (view: ViewMode) => void;
  t?: Dictionary;
}

export const AboutRenewU: React.FC<AboutRenewUProps> = ({ onViewChange }) => {

  const facultyMembers = [
    {
      name: "Dr. Bobby Harrington",
      role: "Lead Executive Director & RENEW.org Point-Leader",
      specialty: "Biblical Theology, Church History & Disciple Making",
      bio: "Fundador y líder principal de RENEW.org y Discipleship.org. Pastor de Harpeth Christian Church en Nashville, TN. Doctor en Ministerio por Southern Baptist Theological Seminary y autor de más de 12 libros de discipulado.",
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Bobby-Harrington-Headshot.jpg"
    },
    {
      name: "Dr. David Young",
      role: "Dean of Theological Studies",
      specialty: "Jesus and the Gospels, Acts & Paul, Biblical Theology",
      bio: "Cofundador de New Day Resources y miembro del consejo de Renew Network. Doctor en Nuevo Testamento por Vanderbilt University. Pastor principal en North Boulevard Church durante 26 años y autor de múltiples obras teológicas.",
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/David-Young-Headshot.jpg"
    },
    {
      name: "Josh Branham",
      role: "Professor of Spiritual Formation",
      specialty: "Spiritual Formation & Youth Leadership",
      bio: "Pastor Principal de Hill City Church en Boise, Idaho. Licenciado por Boise Bible College y Maestría en Ministerio Cristiano por Grand Canyon University. Autor de 'What Are You Waiting For? A Young Leader's Guide to Changing the World'.",
      image: "https://renewuniversity.org/wp-content/uploads/2026/05/JoshuaBranhamHeadshot-1024x1024.jpg"
    },
    {
      name: "Dr. Zach Breitenbach",
      role: "Professor of Christian Evidences",
      specialty: "Christian Evidences & Worldview",
      bio: "Director del Worldview Center en Connection Pointe (IN). Doctor en Teología y Apologética por Liberty University, M.A. por Lincoln Christian University. Ex-Vicedirector de Room For Doubt y autor de 'Slipping Through the Cracks'.",
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Zach-Breitenbach-Headshot.jpg"
    },
    {
      name: "Jeff Duerler",
      role: "Professor of Old Testament Studies",
      specialty: "Overview of the Old Testament",
      bio: "Pastor Senior de LifeSpring Community Christian Church (OH). Ph.D. por Hebrew Union College – Jewish Institute of Religion y M.Div. por Alliance Theological Seminary. Profesor adjunto en Nyack College.",
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Jeff-Duerler-Headshot.jpg"
    },
    {
      name: "Dr. Orpheus J. Heyward",
      role: "Professor of Biblical Exposition",
      specialty: "The Bible: Canon, Inspiration, Hermeneutics",
      bio: "Ministro de Renaissance Church en Atlanta, GA. Doctor en Exégesis Teológica y Ph.D. en Exposición Bíblica. Profesor afiliado de Predicación Expositiva y Liderazgo en Lipscomb University.",
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Orpheus-Heyward-Headshot.jpg"
    },
    {
      name: "Rowlie Hutton",
      role: "Chief Development Officer",
      specialty: "Development & Pastoral Ministry",
      bio: "Más de 35 años de ministerio pastoral en Las Dakotas, Montana y Nebraska. Graduado de Dakota Bible College y Montana State University-Northern. Ex Senador del Estado de Montana defensor de leyes de santidad de la vida.",
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Rowlie-Hutton-Headshot.jpg"
    },
    {
      name: "Jason Ishmael",
      role: "Professor of New Testament Exegesis",
      specialty: "The Book of Romans & Church History",
      bio: "Pastor Principal de Antioch Christian Church (Iowa). B.A. en Predicación por St. Louis Christian College y Maestría en Historia de la Iglesia y Teología Histórica por Lincoln Christian University.",
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Jason-Ishmael-Headshot.jpg"
    },
    {
      name: "Dr. Reggie Rice",
      role: "Professor of Christian Leadership",
      specialty: "Christian Leadership and Ministry Development",
      bio: "Director del CCV Leadership Institute en Christ's Church of the Valley (Phoenix, AZ). Doctor por Johnson University y M.A.R. por Liberty University. Profesor adjunto en Abilene Christian University y GCU.",
      image: "https://renewuniversity.org/wp-content/uploads/2025/11/Reggie-Rice-1024x998.jpeg"
    },
    {
      name: "Dr. Kelvin Teamer",
      role: "Professor of Pastoral Care & Counseling",
      specialty: "Introduction to Crisis Counseling & Family Therapy",
      bio: "Ministro de Adultos en North Boulevard Church of Christ (TN). Doctor en Ministerio y M.Div. en Terapia Matrimonial y Familiar por Amridge University. Autor del libro 'Kingdom Life'.",
      image: "https://renewuniversity.org/wp-content/uploads/2025/11/Untitled-design-3-1-1024x1024.png"
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
            <span>Cuerpo Docente & Consejo Académico (Oficial)</span>
          </div>
          <h2 className="text-2xl font-black text-[#1A1A19]">Profesorado y Catedráticos de Renew University</h2>
          <p className="text-xs text-gray-600 mt-1">
            Conoce a los 10 reconocidos profesores y teólogos del programa académico de RenewU (renewuniversity.org/about/faculty).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {facultyMembers.map((member, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:border-[#D6B858] transition-all hover:shadow-md">
              <img
                src={member.image}
                alt={member.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shrink-0 border-2 border-[#D6B858]/40 shadow-sm"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-base text-[#1A1A19] flex items-center gap-1.5">
                  <span>{member.name}</span>
                </h4>
                <p className="text-xs text-[#725c00] font-bold">{member.role}</p>
                <p className="text-[11px] font-semibold text-gray-500 bg-[#D6B858]/10 px-2 py-0.5 rounded inline-block">
                  Materia / Especialidad: {member.specialty}
                </p>
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
