import React, { useState, useEffect } from "react";
import { GraduationCap, ExternalLink, User } from "lucide-react";
import { Dictionary } from "../data/translations";
import { FacultyMember } from "../types";
import { getStoredFaculty } from "../data/facultyData";

interface FacultyAdvisorsProps {
  t?: Dictionary;
}

export const FacultyAdvisors: React.FC<FacultyAdvisorsProps> = () => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const local = getStoredFaculty();
    setFaculty(local);

    fetch("/api/faculty")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.faculty) && data.faculty.length > 0) {
          setFaculty(data.faculty);
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

  // Show top featured advisors or all members
  const featured = faculty.slice(0, 6);

  return (
    <section className="bg-gray-50 border-t border-[#D6B858]/30 py-12 px-4 sm:px-6 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#D6B858]/20 text-[#725c00] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4 text-[#D6B858]" />
            <span>Cuerpo Docente & Claustro Académico</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#1A1A19]">
            Cuerpo Docente y Consejeros Académicos
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">
            Nuestros instructores teológicos combinan rigurosidad académica con un profundo compromiso pastoral y educativo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((advisor) => (
            <div
              key={advisor.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between items-center text-center space-y-4 hover:border-[#D6B858] transition-all duration-300 group"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  {!imageErrors[advisor.id] ? (
                    <img
                      src={advisor.image}
                      alt={advisor.name}
                      onError={() => handleImageError(advisor.id)}
                      className="w-24 h-24 rounded-full object-cover border-2 border-[#D6B858] shadow-sm group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#1A1A19] text-[#D6B858] border-2 border-[#D6B858] flex flex-col items-center justify-center font-black text-xl shadow-sm">
                      <span>{getInitials(advisor.name)}</span>
                      <User className="w-4 h-4 opacity-70 mt-0.5" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-[#1A1A19] text-[#D6B858] p-1.5 rounded-full shadow-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#1A1A19]">{advisor.name}</h3>
                  <span className="text-[11px] font-semibold text-[#725c00] bg-[#D6B858]/15 px-2.5 py-0.5 rounded-full inline-block mt-1">
                    {advisor.role}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                  {advisor.bioEs || advisor.bioEn}
                </p>
              </div>

              {advisor.externalLink && (
                <a
                  href={advisor.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#725c00] hover:text-[#1A1A19] font-bold mt-2 pt-3 border-t border-gray-100 w-full justify-center transition-colors"
                >
                  <span>Ver perfil en Renew.org</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
