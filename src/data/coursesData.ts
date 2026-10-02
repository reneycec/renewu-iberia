import { Course } from "../types";

export const DEFAULT_COURSES: Course[] = [
  {
    id: "C101",
    moodleCourseId: 3,
    code: "101",
    title: "Jesús y los Evangelios",
    category: "Estudios Bíblicos",
    credits: 3,
    description: "Estudio exhaustivo de la vida, enseñanzas, ministerio, muerte y resurrección de Jesucristo a través del testimonio de los cuatro Evangelios, con enfoque en el discipulado centrado en el Rey Jesús.",
    detailedSyllabus: [
      "Unidad 1: Contexto histórico del primer siglo y naturaleza de los Evangelios",
      "Unidad 2: El Reino de Dios y las enseñanzas esenciales de Jesús",
      "Unidad 3: Pasión, Cruz, Expiación y la Resurrección corporal",
      "Unidad 4: Discipulado basado en la obediencia al Rey Jesús"
    ],
    startDate: "2026-09-01",
    endDate: "2026-10-15",
    registrationDeadline: "2026-08-25",
    instructor: "Dr. David Young",
    priceSingle: 59,
    moodleShortname: "101",
    status: "activo",
    bannerBg: "from-amber-900 to-amber-950"
  },
  {
    id: "M102",
    moodleCourseId: 4,
    code: "201",
    title: "Evidencias cristianas y Apologética",
    category: "Historia y Apologética",
    credits: 3,
    description: "Defensa bíblica, racional e histórica de la fe cristiana. Análisis riguroso de la existencia de Dios, la fiabilidad de los manuscritos y la historicidad de la resurrección.",
    detailedSyllabus: [
      "Unidad 1: Fundamentos epistémicos de las evidencias cristianas",
      "Unidad 2: Argumentos filosóficos y científicos sobre la creación y el diseño",
      "Unidad 3: La evidencia histórica de la resurrección de Jesucristo",
      "Unidad 4: Respuestas apologéticas frente al escepticismo contemporáneo"
    ],
    startDate: "2026-09-15",
    endDate: "2026-10-30",
    registrationDeadline: "2026-09-08",
    instructor: "Dr. Zach Breitenbach",
    priceSingle: 59,
    moodleShortname: "201",
    status: "activo",
    bannerBg: "from-indigo-950 to-[#1A1A19]"
  },
  {
    id: "B101",
    moodleCourseId: 6,
    code: "301",
    title: "La Biblia, el canon, la inspiración y la hermenéutica",
    category: "Estudios Bíblicos",
    credits: 3,
    description: "Análisis histórico-teológico sobre la formación del canon de las Escrituras, la doctrina de la inspiración e inerrancia bíblica, y los principios exegéticos para una fiel interpretación.",
    detailedSyllabus: [
      "Unidad 1: Formación y reconocimiento del canon del AT y NT",
      "Unidad 2: Doctrina de la inspiración divina y autoridad de la Palabra",
      "Unidad 3: Métodos exegéticos y análisis de géneros literarios bíblicos",
      "Unidad 4: Hermenéutica práctica aplicada a la predicación y enseñanza"
    ],
    startDate: "2026-10-01",
    endDate: "2026-11-15",
    registrationDeadline: "2026-09-22",
    instructor: "Dr. Orpheus J. Heyward",
    priceSingle: 59,
    moodleShortname: "301",
    status: "activo",
    bannerBg: "from-blue-900 to-slate-900"
  },
  {
    id: "B102",
    moodleCourseId: 5,
    code: "401",
    title: "Panorama del Antiguo Testamento",
    category: "Estudios Bíblicos",
    credits: 3,
    description: "Recorrido teológico e histórico del Pentateuco, los Libros Históricos, Poéticos y Proféticos, trazando el pacto divino con Israel y la promesa mesiánica consumada en Cristo.",
    detailedSyllabus: [
      "Unidad 1: Creación, Caída y Alianzas en el Pentateuco",
      "Unidad 2: Monarquía, Templo, Profecía y el Exilio babilónico",
      "Unidad 3: Sabiduría y Alabanza en los Escritos Poéticos",
      "Unidad 4: Los Profetas Mayores, Menores y la Esperanza Mesiánica"
    ],
    startDate: "2026-10-15",
    endDate: "2026-11-30",
    registrationDeadline: "2026-10-05",
    instructor: "Jeff Duerler",
    priceSingle: 59,
    moodleShortname: "401",
    status: "activo",
    bannerBg: "from-amber-800 to-[#1A1A19]"
  },
  {
    id: "C501",
    moodleCourseId: 7,
    code: "501",
    title: "Hechos y el apóstol Pablo",
    category: "Estudios Bíblicos",
    credits: 3,
    description: "Estudio del nacimiento y expansión de la Iglesia Primitiva en el libro de Hechos, los viajes misioneros y la teología apostólica de las primeras comunidades cristianas.",
    detailedSyllabus: [
      "Unidad 1: El derramamiento del Espíritu Santo en Pentecostés",
      "Unidad 2: La conversión de Saulo y la misión a los gentiles",
      "Unidad 3: Los viajes misioneros de Pablo y el Concilio de Jerusalén",
      "Unidad 4: Plantación de iglesias y desafíos misioneros en el Imperio Romano"
    ],
    startDate: "2026-11-01",
    endDate: "2026-12-15",
    registrationDeadline: "2026-10-22",
    instructor: "Dr. David Young",
    priceSingle: 59,
    moodleShortname: "501",
    status: "activo",
    bannerBg: "from-amber-950 to-zinc-900"
  },
  {
    id: "C601",
    moodleCourseId: 8,
    code: "601",
    title: "La Epístola a los Romanos",
    category: "Estudios Bíblicos",
    credits: 3,
    description: "Exégesis detallada de la carta magna del apóstol Pablo sobre la justicia de Dios, la depravación humana, la justificación por la fe en Cristo, la santificación y la vida en el Espíritu.",
    detailedSyllabus: [
      "Unidad 1: La necesidad universal del Evangelio (Romanos 1-3)",
      "Unidad 2: Justificación por la fe y paz con Dios (Romanos 4-5)",
      "Unidad 3: Libertad del pecado y vida en el Espíritu (Romanos 6-8)",
      "Unidad 4: El plan de Dios para Israel y la ética comunitaria (Romanos 9-16)"
    ],
    startDate: "2026-11-15",
    endDate: "2026-12-30",
    registrationDeadline: "2026-11-05",
    instructor: "Jason Ishmael",
    priceSingle: 59,
    moodleShortname: "601",
    status: "activo",
    bannerBg: "from-stone-900 to-amber-950"
  },
  {
    id: "S101",
    moodleCourseId: 9,
    code: "701",
    title: "Teología bíblica",
    category: "Teología Sistemática",
    credits: 3,
    description: "Estudio de las grandes doctrinas cristianas a lo largo de toda la narrativa bíblica, centrado en el gobierno de Dios, la redención, el pacto y la victoria de Jesucristo.",
    detailedSyllabus: [
      "Unidad 1: Definición y método de la teología bíblica",
      "Unidad 2: Revelación divina y la naturaleza de las Escrituras",
      "Unidad 3: Cristocentrismo y el propósito redentor de Dios",
      "Unidad 4: Vivir la teología en la misión cotidiana y la iglesia local"
    ],
    startDate: "2027-01-10",
    endDate: "2027-02-25",
    registrationDeadline: "2027-01-02",
    instructor: "Dr. Bobby Harrington",
    priceSingle: 59,
    moodleShortname: "701",
    status: "activo",
    bannerBg: "from-amber-950 to-[#1A1A19]"
  },
  {
    id: "C801",
    moodleCourseId: 10,
    code: "801",
    title: "La historia de la iglesia y la búsqueda de la fe bíblica",
    category: "Historia y Apologética",
    credits: 3,
    description: "Recorrido histórico de la iglesia desde los padres apostólicos, pasando por la Reforma Protestante del siglo XVI, hasta el Movimiento de Restauración y su relevancia actual.",
    detailedSyllabus: [
      "Unidad 1: La Iglesia Primitiva, mártires y concilios ecuménicos",
      "Unidad 2: La Reforma del Siglo XVI y el retorno a las Escrituras",
      "Unidad 3: El Movimiento de Restauración: unidad en la verdad bíblica",
      "Unidad 4: Lecciones históricas para el liderazgo eclesial de hoy"
    ],
    startDate: "2027-01-25",
    endDate: "2027-03-10",
    registrationDeadline: "2027-01-15",
    instructor: "Jason Ishmael",
    priceSingle: 59,
    moodleShortname: "801",
    status: "activo",
    bannerBg: "from-[#1A1A19] to-amber-900"
  },
  {
    id: "M101",
    moodleCourseId: 11,
    code: "901",
    title: "Ministerio y liderazgo cristianos",
    category: "Ministerio Práctico",
    credits: 3,
    description: "Desarrollo del carácter espiritual del líder cristiano, formación de equipos de discipulado multiplicador, salud ministerial y gobernanza bíblica en la iglesia local.",
    detailedSyllabus: [
      "Unidad 1: El modelo de liderazgo de servicio de Jesús",
      "Unidad 2: Salud emocional y espiritual del ministro",
      "Unidad 3: Creación y multiplicación de culturas de discipulado",
      "Unidad 4: Resolución bíblica de conflictos y mentoría pastoral"
    ],
    startDate: "2027-02-10",
    endDate: "2027-03-25",
    registrationDeadline: "2027-02-01",
    instructor: "Dr. Reggie Rice",
    priceSingle: 59,
    moodleShortname: "901",
    status: "activo",
    bannerBg: "from-emerald-900 to-slate-900"
  },
  {
    id: "M103",
    moodleCourseId: 12,
    code: "1001",
    title: "Formación espiritual",
    category: "Ministerio Práctico",
    credits: 3,
    description: "Prácticas y disciplinas espirituales cristianas (oración, ayuno, meditación bíblica, soledad y silencio) para una transformación personal profunda y madurez duradera en Cristo.",
    detailedSyllabus: [
      "Unidad 1: La teología de la transformación espiritual y el corazón renovado",
      "Unidad 2: Las disciplinas de devoción interior y comunión con Dios",
      "Unidad 3: Superación de la fatiga ministerial mediante ritmos santos",
      "Unidad 4: Hábitos diarios para el sostenimiento espiritual del líder"
    ],
    startDate: "2027-03-01",
    endDate: "2027-04-15",
    registrationDeadline: "2027-02-20",
    instructor: "Josh Branham",
    priceSingle: 59,
    moodleShortname: "1001",
    status: "activo",
    bannerBg: "from-slate-900 to-amber-950"
  },
  {
    id: "M1002",
    moodleCourseId: 13,
    code: "1002",
    title: "Introducción al asesoramiento en situaciones de crisis",
    category: "Ministerio Práctico",
    credits: 3,
    description: "Principios de consejería bíblica y primeros auxilios emocionales para pastores y líderes eclesiásticos frente a duelos, traumas, crisis familiares y quebranto personal.",
    detailedSyllabus: [
      "Unidad 1: Teología del sufrimiento y fundamentos del cuidado pastoral",
      "Unidad 2: Primeros auxilios psicológicos y emocionales desde la perspectiva bíblica",
      "Unidad 3: Intervención pastoral en duelo, trauma y crisis conyugales",
      "Unidad 4: Ética del consejero, confidencialidad y derivación responsable"
    ],
    startDate: "2027-03-15",
    endDate: "2027-04-30",
    registrationDeadline: "2027-03-05",
    instructor: "Dr. Kelvin Teamer",
    priceSingle: 59,
    moodleShortname: "1002",
    status: "activo",
    bannerBg: "from-zinc-900 to-amber-950"
  },
  {
    id: "M1003",
    moodleCourseId: 14,
    code: "1003",
    title: "Hacer discípulos: La misión central de la Iglesia",
    category: "Ministerio Práctico",
    credits: 3,
    description: "Modelo teológico y práctico del discipulado multiplicador según Jesús. Estrategias comprobadas para convertir a la iglesia local en una comunidad activa de hacedores de discípulos.",
    detailedSyllabus: [
      "Unidad 1: El mandato de la Gran Comisión y el modelo de discipulado de Jesús",
      "Unidad 2: Las cinco etapas del crecimiento del discípulo (Discipleshift)",
      "Unidad 3: Grupos de discipulado relacional: estructura, dinámica y multiplicación",
      "Unidad 4: Transformación de la cultura eclesial hacia una misión discipuladora"
    ],
    startDate: "2027-04-01",
    endDate: "2027-05-15",
    registrationDeadline: "2027-03-22",
    instructor: "Dr. Bobby Harrington",
    priceSingle: 59,
    moodleShortname: "1003",
    status: "activo",
    bannerBg: "from-amber-900 to-[#1A1A19]"
  }
];

const STORAGE_KEY = "renewu_courses_catalog_v6";

export function getStoredCourses(): Course[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length >= DEFAULT_COURSES.length) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading courses from localStorage", e);
  }
  saveStoredCourses(DEFAULT_COURSES);
  return DEFAULT_COURSES;
}

export function saveStoredCourses(courses: Course[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error("Error saving courses to localStorage", e);
  }
}

export function updateCoursePrice(courseId: string, newPrice: number): Course[] {
  const current = getStoredCourses();
  const updated = current.map((c) => (c.id === courseId ? { ...c, priceSingle: newPrice } : c));
  saveStoredCourses(updated);
  return updated;
}

export function updateAllCoursePrices(newPrice: number): Course[] {
  const current = getStoredCourses();
  const updated = current.map((c) => ({ ...c, priceSingle: newPrice }));
  saveStoredCourses(updated);
  return updated;
}

export function resetStoredCourses(): Course[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error resetting courses", e);
  }
  return DEFAULT_COURSES;
}
