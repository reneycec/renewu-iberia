import { Course } from "../types";

export const DEFAULT_COURSES: Course[] = [
  {
    id: "S101",
    moodleCourseId: 101,
    code: "S101",
    title: "Introducción a la Teología Cristiana",
    category: "Teología Sistemática",
    credits: 3,
    description: "Estudio fundamental de las doctrinas cristianas esenciales, la naturaleza de la revelación divina, las escrituras sagradas y la metodología del pensamiento teológico bíblico centrado en Cristo.",
    detailedSyllabus: [
      "Unidad 1: Definición y método de la teología cristiana",
      "Unidad 2: Revelación general vs. Revelación especial",
      "Unidad 3: La autoridad e inerrancia de las Escrituras",
      "Unidad 4: Aplicación teológica en la vida práctica y la iglesia"
    ],
    startDate: "2026-09-01",
    endDate: "2026-10-15",
    registrationDeadline: "2026-08-25",
    instructor: "Dr. Bobby Harrington",
    priceSingle: 59,
    moodleShortname: "RENEW-S101",
    status: "activo",
    bannerBg: "from-amber-900 to-amber-950"
  },
  {
    id: "B101",
    moodleCourseId: 102,
    code: "B101",
    title: "Hermenéutica y Metodología Bíblica",
    category: "Estudios Bíblicos",
    credits: 3,
    description: "Principios exegéticos y reglas de interpretación para comprender contextualmente el texto bíblico en sus idiomas y géneros literarios originales, aplicándolo fielmente al contexto moderno.",
    detailedSyllabus: [
      "Unidad 1: Historia de la interpretación bíblica",
      "Unidad 2: Contexto histórico, cultural y gramatical",
      "Unidad 3: Géneros literarios (Narrativa, Poesía, Epístolas, Apocalíptica)",
      "Unidad 4: De la exégesis a la aplicación contemporánea"
    ],
    startDate: "2026-09-15",
    endDate: "2026-10-30",
    registrationDeadline: "2026-09-08",
    instructor: "Dr. Chad Ragsdale",
    priceSingle: 59,
    moodleShortname: "RENEW-B101",
    status: "activo",
    bannerBg: "from-blue-900 to-slate-900"
  },
  {
    id: "B102",
    moodleCourseId: 103,
    code: "B102",
    title: "Panorama del Antiguo Testamento",
    category: "Estudios Bíblicos",
    credits: 3,
    description: "Recorrido teológico e histórico del Pentateuco, Libros Históricos, Poéticos y Proféticos, trazando el pacto de Dios con Israel y la promesa mesiánica.",
    detailedSyllabus: [
      "Unidad 1: Creación, Caída y Pacto en el Pentateuco",
      "Unidad 2: Conquista, Monarquía y Exilio en los Históricos",
      "Unidad 3: Sabiduría y Alabanza en los Libros Poéticos",
      "Unidad 4: Los Profetas Mayores y Menores y el Mesías Prometido"
    ],
    startDate: "2026-10-01",
    endDate: "2026-11-15",
    registrationDeadline: "2026-09-22",
    instructor: "Prof. Antonio García",
    priceSingle: 59,
    moodleShortname: "RENEW-B102",
    status: "proximo",
    bannerBg: "from-amber-800 to-[#1A1A19]"
  },
  {
    id: "B103",
    moodleCourseId: 104,
    code: "B103",
    title: "Panorama del Nuevo Testamento",
    category: "Estudios Bíblicos",
    credits: 3,
    description: "Análisis del contexto del primer siglo, los Evangelios Sinópticos, la vida de Cristo, el surgimiento de la Iglesia en Hechos, las Epístolas Paulinas y Generales, y el libro de Apocalipsis.",
    detailedSyllabus: [
      "Unidad 1: El período intertestamentario y los Evangelios",
      "Unidad 2: El libro de Hechos y la expansión de la Iglesia",
      "Unidad 3: Las Epístolas de Pablo: Teología y Praxis",
      "Unidad 4: Epístolas Generales y la Esperanza Apocalíptica"
    ],
    startDate: "2026-10-15",
    endDate: "2026-11-30",
    registrationDeadline: "2026-10-05",
    instructor: "Dr. David Young",
    priceSingle: 59,
    moodleShortname: "RENEW-B103",
    status: "proximo",
    bannerBg: "from-stone-900 to-amber-950"
  },
  {
    id: "S102",
    moodleCourseId: 105,
    code: "S102",
    title: "Teología Sistemática I: Dios y Revelación",
    category: "Teología Sistemática",
    credits: 3,
    description: "Estudio exhaustivo de la Teontología (la naturaleza y atributos de Dios), la Doctrina de la Trinidad, la Creación, la Providencia Divina y la Cristología Trinitaria.",
    detailedSyllabus: [
      "Unidad 1: Los Atributos Incomunicables y Comunicables de Dios",
      "Unidad 2: La Trinidad: Un Dios en tres Personas",
      "Unidad 3: Creación, Ángeles y Providencia",
      "Unidad 4: La Soberanía de Dios y la responsabilidad humana"
    ],
    startDate: "2026-11-01",
    endDate: "2026-12-15",
    registrationDeadline: "2026-10-22",
    instructor: "Dr. Bobby Harrington",
    priceSingle: 59,
    moodleShortname: "RENEW-S102",
    status: "proximo",
    bannerBg: "from-amber-950 to-[#1A1A19]"
  },
  {
    id: "S103",
    moodleCourseId: 106,
    code: "S103",
    title: "Teología Sistemática II: Cristología y Soteriología",
    category: "Teología Sistemática",
    credits: 3,
    description: "Profundización en la persona y obra encarnada de Jesucristo, la Expiación vicaria, la Gracia, la Regeneración, la Justificación por la Fe y la Santificación progresiva.",
    detailedSyllabus: [
      "Unidad 1: La Humanidad y Deidad de Jesucristo",
      "Unidad 2: Teorías de la Expiación y la Cruz",
      "Unidad 3: Arrepentimiento, Fe y Justificación",
      "Unidad 4: La obra del Espíritu Santo en la Santificación"
    ],
    startDate: "2026-11-15",
    endDate: "2026-12-30",
    registrationDeadline: "2026-11-05",
    instructor: "Dr. Chad Ragsdale",
    priceSingle: 59,
    moodleShortname: "RENEW-S103",
    status: "proximo",
    bannerBg: "from-amber-900 to-zinc-900"
  },
  {
    id: "M101",
    moodleCourseId: 107,
    code: "M101",
    title: "Liderazgo Pastoral y Discipulado Transformativo",
    category: "Ministerio Práctico",
    credits: 3,
    description: "Estrategias de discipulado personal y comunitario basadas en el modelo de Jesús, formación de nuevos líderes en la iglesia local y gestión saludable del ministerio pastoral.",
    detailedSyllabus: [
      "Unidad 1: El modelo relacional de discipulado de Jesús",
      "Unidad 2: Carácter, espiritualidad y salud del líder pastoral",
      "Unidad 3: Multiplicación de grupos pequeños y mentores",
      "Unidad 4: Manejo biblico del conflicto y cuidado del rebaño"
    ],
    startDate: "2027-01-10",
    endDate: "2027-02-25",
    registrationDeadline: "2027-01-02",
    instructor: "Dr. Bobby Harrington",
    priceSingle: 59,
    moodleShortname: "RENEW-M101",
    status: "proximo",
    bannerBg: "from-emerald-900 to-slate-900"
  },
  {
    id: "M102",
    moodleCourseId: 108,
    code: "M102",
    title: "Apologética y Cosmovisión Cristiana",
    category: "Historia y Apologética",
    credits: 3,
    description: "Defensa bíblica y racional de la fe cristiana frente al secularismo, relativismo y escepticismo cultural. Análisis de argumentos sobre la existencia de Dios y la resurrección de Cristo.",
    detailedSyllabus: [
      "Unidad 1: Fundamentos teóricos de la apologética",
      "Unidad 2: El problema del mal y el sufrimiento",
      "Unidad 3: Argumentos históricos sobre la Resurrección",
      "Unidad 4: Diálogo apologético en la cultura digital actual"
    ],
    startDate: "2027-01-25",
    endDate: "2027-03-10",
    registrationDeadline: "2027-01-15",
    instructor: "Dr. Chad Ragsdale",
    priceSingle: 59,
    moodleShortname: "RENEW-M102",
    status: "proximo",
    bannerBg: "from-indigo-950 to-[#1A1A19]"
  },
  {
    id: "M103",
    moodleCourseId: 109,
    code: "M103",
    title: "Ética Cristiana en la Sociedad Actual",
    category: "Historia y Apologética",
    credits: 3,
    description: "Evaluación teológica de dilemas morales contemporáneos, bioética, justicia social, sexualidad bíblica, mayordomía financiera y testimonio cristiano en la esfera pública.",
    detailedSyllabus: [
      "Unidad 1: La Ley moral de Dios y el Sermón del Monte",
      "Unidad 2: Bioética y la santidad de la vida humana",
      "Unidad 3: Matrimonio, familia y sexualidad bíblica",
      "Unidad 4: Ética del trabajo, economía y responsabilidad social"
    ],
    startDate: "2027-02-10",
    endDate: "2027-03-25",
    registrationDeadline: "2027-02-01",
    instructor: "Prof. Antonio García",
    priceSingle: 59,
    moodleShortname: "RENEW-M103",
    status: "proximo",
    bannerBg: "from-slate-900 to-amber-950"
  },
  {
    id: "E101",
    moodleCourseId: 110,
    code: "E101",
    title: "Eclesiología y Misión Global",
    category: "Teología Sistemática",
    credits: 3,
    description: "Naturaleza, marcas y ordenanzas de la Iglesia local (Bautismo y Cena del Señor), su estructura organizativa y su papel activo en la Gran Comisión global.",
    detailedSyllabus: [
      "Unidad 1: La Iglesia como Cuerpo de Cristo y Templo del Espíritu",
      "Unidad 2: Las ordenanzas del Bautismo y la Cena del Señor",
      "Unidad 3: Estructura del liderazgo: Ancianos, Diáconos y Siervos",
      "Unidad 4: Plantación de iglesias y Misión Transcultural"
    ],
    startDate: "2027-03-01",
    endDate: "2027-04-15",
    registrationDeadline: "2027-02-20",
    instructor: "Dr. David Young",
    priceSingle: 59,
    moodleShortname: "RENEW-E101",
    status: "proximo",
    bannerBg: "from-amber-950 to-neutral-900"
  },
  {
    id: "H101",
    moodleCourseId: 111,
    code: "H101",
    title: "Historia de la Iglesia y del Dogma Cristiano",
    category: "Historia y Apologética",
    credits: 3,
    description: "Estudio de los padres apostólicos, los primeros concilios ecuménicos, la Reforma Protestante del Siglo XVI, los Grandes Despertares y el Movimiento de Restauración.",
    detailedSyllabus: [
      "Unidad 1: La Iglesia Primitiva y las Persecuciones Romanas",
      "Unidad 2: Los Concilios Ecuménicos (Nicea, Calcedonia)",
      "Unidad 3: La Reforma Protestante (Lutero, Calvino, Zwinglio)",
      "Unidad 4: El Movimiento de Restauración y los Despertares Modernos"
    ],
    startDate: "2027-03-20",
    endDate: "2027-05-05",
    registrationDeadline: "2027-03-10",
    instructor: "Prof. Antonio García",
    priceSingle: 59,
    moodleShortname: "RENEW-H101",
    status: "proximo",
    bannerBg: "from-[#1A1A19] to-amber-900"
  },
  {
    id: "M104",
    moodleCourseId: 112,
    code: "M104",
    title: "Ministerio Práctico y Homilética Expositiva",
    category: "Ministerio Práctico",
    credits: 3,
    description: "Técnicas y principios de preparación de sermones expositivos biblicamente rigurosos, consejería bíblica básica y dirección de cultos comunitarios inspiradores.",
    detailedSyllabus: [
      "Unidad 1: Anatomía de la predicación expositiva",
      "Unidad 2: Estructura, bosquejo y comunicación oral efectiva",
      "Unidad 3: Introducción a la Consejería Pastoral Bíblica",
      "Unidad 4: Proyecto Final de Graduación y Síntesis Teológica"
    ],
    startDate: "2027-04-10",
    endDate: "2027-05-25",
    registrationDeadline: "2027-03-30",
    instructor: "Dr. Bobby Harrington",
    priceSingle: 59,
    moodleShortname: "RENEW-M104",
    status: "proximo",
    bannerBg: "from-zinc-900 to-amber-900"
  }
];

const STORAGE_KEY = "renewu_courses_catalog_v1";

export function getStoredCourses(): Course[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading courses from localStorage", e);
  }
  return DEFAULT_COURSES;
}

export function saveStoredCourses(courses: Course[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error("Error saving courses to localStorage", e);
  }
}

export function resetStoredCourses(): Course[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error resetting courses", e);
  }
  return DEFAULT_COURSES;
}
