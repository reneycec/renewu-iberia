import React from "react";
import { GraduationCap, Award, BookOpen, Mail } from "lucide-react";
import { Dictionary } from "../data/translations";

interface FacultyAdvisorsProps {
  t?: Dictionary;
}

export const FacultyAdvisors: React.FC<FacultyAdvisorsProps> = ({ t }) => {

  const advisors = [
    {
      name: "Dra. Elena Valenzuela",
      role: "Decana de Estudios Teológicos",
      bio: "Doctora en Teología Histórica por el Seminario Teológico. Autora de 4 libros sobre hermenéutica y liderazgo eclesial.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Dr. Roberto Mendoza",
      role: "Profesor de Soteriología e Historia",
      bio: "Especialista en Historia del Cristianismo Global y Teología Sistemática con más de 18 años de cátedra universitaria.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Mtra. Sofía Benítez",
      role: "Coordinadora de Estudiantes y Moodle",
      bio: "Master en Pedagogía Universitaria y Tecnología Educativa. Encargada del acompañamiento tutorial en la plataforma Moodle.",
      avatar: "https://images.unsplash.com/photo-1580894732413-8012643a6d45?w=400&auto=format&fit=crop&q=80",
    }
  ];

  return (
    <section className="bg-gray-50 border-t border-[#D6B858]/30 py-12 px-4 sm:px-6 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A19]">
            Cuerpo Docente y Consejeros Académicos
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">
            Nuestros instructores teológicos combinan rigurosidad académica con un profundo compromiso pastoral y educativo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advisors.map((advisor, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col items-center text-center space-y-4 hover:border-[#D6B858] transition-all group"
            >
              <div className="relative">
                <img
                  src={advisor.avatar}
                  alt={advisor.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#D6B858] shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#1A1A19] text-[#D6B858] p-1.5 rounded-full shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-[#1A1A19]">{advisor.name}</h3>
                <span className="text-xs font-semibold text-[#725c00] bg-[#D6B858]/15 px-2.5 py-0.5 rounded-full inline-block mt-1">
                  {advisor.role}
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {advisor.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
