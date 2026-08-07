import React from "react";
import { GraduationCap, Award, BookOpen, Mail } from "lucide-react";
import { Dictionary } from "../data/translations";

interface FacultyAdvisorsProps {
  t?: Dictionary;
}

export const FacultyAdvisors: React.FC<FacultyAdvisorsProps> = ({ t }) => {

  const advisors = [
    {
      name: "Dr. Bobby Harrington",
      role: "Fundador RENEW.org & Director",
      bio: "Doctor en Ministerio por Southern Baptist Theological Seminary. Pastor principal y autor de más de 12 libros de discipulado.",
      avatar: "https://renewuniversity.org/wp-content/uploads/2025/04/Bobby-Harrington-Headshot.jpg",
    },
    {
      name: "Dr. David Young",
      role: "Decano de Estudios Teológicos",
      bio: "Doctor en Teología y Nuevo Testamento por Vanderbilt University. Pastor principal en North Boulevard Church durante 26 años.",
      avatar: "https://renewuniversity.org/wp-content/uploads/2025/04/David-Young-Headshot.jpg",
    },
    {
      name: "Dr. Orpheus J. Heyward",
      role: "Catedrático de Exposición Bíblica",
      bio: "Ph.D. en Exposición Bíblica y Doctor en Exégesis Teológica. Profesor en Lipscomb University y ministro en Atlanta, GA.",
      avatar: "https://renewuniversity.org/wp-content/uploads/2025/04/Orpheus-Heyward-Headshot.jpg",
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
